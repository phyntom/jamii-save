import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { verifyToken } from '@/server/authentication';

const sql = neon(process.env.DATABASE_URL!);

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const payload = await verifyToken(token);
  const userId = payload.userId;

  const users = await sql`
    SELECT role FROM users WHERE id = ${userId}
  `;

  if (users.length === 0 || users[0].role !== 'super_admin') {
    throw new Error('Unauthorized - Admin access required');
  }

  return userId;
}

export async function getAllUsers() {
  await getAdminUser();

  const users = await sql`
    SELECT 
      id, 
      email, 
      full_name, 
      phone, 
      role, 
      created_at,
      (SELECT COUNT(*) FROM group_members WHERE user_id = users.id) as group_count
    FROM users
    ORDER BY created_at DESC
  `;

  return users;
}

export async function updateUserRole(userId: string, role: string) {
  await getAdminUser();

  await sql`
    UPDATE users
    SET role = ${role}, updated_at = NOW()
    WHERE id = ${userId}
  `;

  return { success: true };
}

export async function getAuditLogs(limit = 100) {
  await getAdminUser();

  const logs = await sql`
    SELECT 
      al.*,
      u.email as user_email,
      u.full_name as user_name
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT ${limit}
  `;

  return logs;
}

export async function getSystemStats() {
  await getAdminUser();

  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM groups) as total_groups,
      (SELECT COUNT(*) FROM contributions WHERE status = 'approved') as total_contributions,
      (SELECT COALESCE(SUM(amount), 0) FROM contributions WHERE status = 'approved') as total_amount,
      (SELECT COUNT(*) FROM loans) as total_loans,
      (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE status = 'approved') as total_loan_amount,
      (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
      (SELECT COUNT(*) FROM groups WHERE created_at > NOW() - INTERVAL '30 days') as new_groups_30d
  `;

  return stats[0];
}

export async function getRecentActivity() {
  await getAdminUser();

  const activity = await sql`
    (
      SELECT 
        'contribution' as type,
        c.id,
        c.amount,
        c.created_at,
        u.full_name as user_name,
        g.name as group_name
      FROM contributions c
      JOIN users u ON c.user_id = u.id
      JOIN groups g ON c.group_id = g.id
      ORDER BY c.created_at DESC
      LIMIT 10
    )
    UNION ALL
    (
      SELECT 
        'loan' as type,
        l.id,
        l.amount,
        l.created_at,
        u.full_name as user_name,
        g.name as group_name
      FROM loans l
      JOIN users u ON l.user_id = u.id
      JOIN groups g ON l.group_id = g.id
      ORDER BY l.created_at DESC
      LIMIT 10
    )
    ORDER BY created_at DESC
    LIMIT 20
  `;

  return activity;
}

export async function getGroupsWithStats() {
  await getAdminUser();

  const groups = await sql`
    SELECT 
      g.*,
      u.full_name as creator_name,
      (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
      (SELECT COALESCE(SUM(amount), 0) FROM contributions WHERE group_id = g.id AND status = 'approved') as total_contributions,
      (SELECT COALESCE(SUM(amount), 0) FROM loans WHERE group_id = g.id AND status = 'approved') as total_loans
    FROM groups g
    LEFT JOIN users u ON g.created_by = u.id
    ORDER BY g.created_at DESC
  `;

  return groups;
}

export async function deleteGroup(groupId: string) {
  const adminId = await getAdminUser();

  // Check if group has active loans
  const activeLoans = await sql`
    SELECT COUNT(*) as count
    FROM loans
    WHERE group_id = ${groupId} 
    AND status IN ('approved', 'disbursed')
    AND amount_repaid < amount
  `;

  if (activeLoans[0].count > 0) {
    throw new Error('Cannot delete group with active loans');
  }

  // Delete group and related data
  await sql`DELETE FROM group_members WHERE group_id = ${groupId}`;
  await sql`DELETE FROM contributions WHERE group_id = ${groupId}`;
  await sql`DELETE FROM loans WHERE group_id = ${groupId}`;
  await sql`DELETE FROM groups WHERE id = ${groupId}`;

  // Log the action
  await sql`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (${adminId}, 'delete', 'group', ${groupId}, '{"reason": "admin_deletion"}')
  `;

  return { success: true };
}

export async function suspendUser(userId: string, reason: string) {
  const adminId = await getAdminUser();

  await sql`
    UPDATE users
    SET role = 'suspended', updated_at = NOW()
    WHERE id = ${userId}
  `;

  await sql`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (${adminId}, 'suspend', 'user', ${userId}, ${JSON.stringify({ reason })})
  `;

  return { success: true };
}
