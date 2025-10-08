"use server"

import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
  contributionFrequency: z.enum(["weekly", "biweekly", "monthly"]),
  contributionAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Contribution amount must be a positive number",
  }),
  contributionDay: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
    message: "Contribution day must be a valid number",
  }),
  loanInterestRate: z.string().optional(),
  maxLoanAmount: z.string().optional(),
  lateFeeAmount: z.string().optional(),
  gracePeriodDays: z.string().optional(),
})

const inviteMemberSchema = z.object({
  groupId: z.string(),
  email: z.string().email("Invalid email address"),
})

export async function createGroup(formData: FormData) {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    contributionFrequency: formData.get("contributionFrequency") as string,
    contributionAmount: formData.get("contributionAmount") as string,
    contributionDay: formData.get("contributionDay") as string,
    loanInterestRate: formData.get("loanInterestRate") as string,
    maxLoanAmount: formData.get("maxLoanAmount") as string,
    lateFeeAmount: formData.get("lateFeeAmount") as string,
    gracePeriodDays: formData.get("gracePeriodDays") as string,
  }

  const validation = createGroupSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const {
    name,
    description,
    contributionFrequency,
    contributionAmount,
    contributionDay,
    loanInterestRate,
    maxLoanAmount,
    lateFeeAmount,
    gracePeriodDays,
  } = validation.data

  try {
    // Check user's plan limits
    const subscription = await sql`
      SELECT p.max_groups
      FROM jamii.user_subscriptions us
      JOIN jamii.plans p ON us.plan_id = p.id
      WHERE us.user_id = ${user.id} AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `

    if (subscription.length === 0) {
      return { error: "No active subscription found" }
    }

    const maxGroups = subscription[0].max_groups

    const currentGroups = await sql`
      SELECT COUNT(*) as count
      FROM jamii.groups
      WHERE created_by = ${user.id}
    `

    if (Number(currentGroups[0].count) >= maxGroups) {
      return { error: `You've reached your plan limit of ${maxGroups} groups. Please upgrade your plan.` }
    }

    // Create the group
    const result = await sql`
      INSERT INTO jamii.groups (
        name, description, created_by, contribution_frequency, 
        contribution_amount, contribution_day, loan_interest_rate,
        max_loan_amount, late_fee_amount, grace_period_days
      )
      VALUES (
        ${name},
        ${description || null},
        ${user.id},
        ${contributionFrequency},
        ${Number(contributionAmount)},
        ${Number(contributionDay)},
        ${loanInterestRate ? Number(loanInterestRate) : 0},
        ${maxLoanAmount ? Number(maxLoanAmount) : null},
        ${lateFeeAmount ? Number(lateFeeAmount) : 0},
        ${gracePeriodDays ? Number(gracePeriodDays) : 0}
      )
      RETURNING id
    `

    const groupId = result[0].id

    // Add creator as admin member
    await sql`
      INSERT INTO jamii.group_members (group_id, user_id, role, status)
      VALUES (${groupId}, ${user.id}, 'admin', 'active')
    `

    revalidatePath("/dashboard/groups")
    return { success: true, groupId }
  } catch (error) {
    console.error("[v0] Create group error:", error)
    return { error: "Failed to create group. Please try again." }
  }
}

export async function inviteMember(formData: FormData) {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  const data = {
    groupId: formData.get("groupId") as string,
    email: formData.get("email") as string,
  }

  const validation = inviteMemberSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { groupId, email } = validation.data

  try {
    // Check if user is admin of the group
    const membership = await sql`
      SELECT role FROM jamii.group_members
      WHERE group_id = ${Number(groupId)} AND user_id = ${user.id} AND status = 'active'
    `

    if (membership.length === 0 || membership[0].role !== "admin") {
      return { error: "You do not have permission to invite members to this group" }
    }

    // Check group member limit
    const group = await sql`
      SELECT g.id, us.plan_id, p.max_members_per_group
      FROM jamii.groups g
      JOIN jamii.user_subscriptions us ON g.created_by = us.user_id AND us.status = 'active'
      JOIN jamii.plans p ON us.plan_id = p.id
      WHERE g.id = ${Number(groupId)}
      ORDER BY us.created_at DESC
      LIMIT 1
    `

    if (group.length === 0) {
      return { error: "Group not found" }
    }

    const maxMembers = group[0].max_members_per_group

    const currentMembers = await sql`
      SELECT COUNT(*) as count
      FROM jamii.group_members
      WHERE group_id = ${Number(groupId)} AND status IN ('active', 'pending')
    `

    if (Number(currentMembers[0].count) >= maxMembers) {
      return { error: `Group has reached the maximum of ${maxMembers} members for your plan` }
    }

    // Check if user is already a member or invited
    const existingMember = await sql`
      SELECT id FROM jamii.group_members
      WHERE group_id = ${Number(groupId)} AND user_id IN (
        SELECT id FROM jamii.user WHERE email = ${email}
      )
    `

    if (existingMember.length > 0) {
      return { error: "User is already a member of this group" }
    }

    const existingInvite = await sql`
      SELECT id FROM jamii.group_invitations
      WHERE group_id = ${Number(groupId)} AND email = ${email} AND status = 'pending'
    `

    if (existingInvite.length > 0) {
      return { error: "An invitation has already been sent to this email" }
    }

    // Create invitation
    const token = crypto.randomUUID()
    await sql`
      INSERT INTO jamii.group_invitations (
        group_id, invited_by, email, token, expires_at
      )
      VALUES (
        ${Number(groupId)},
        ${user.id},
        ${email},
        ${token},
        NOW() + INTERVAL '7 days'
      )
    `

    // TODO: Send invitation email

    revalidatePath(`/dashboard/groups/${groupId}`)
    return { success: true, message: "Invitation sent successfully" }
  } catch (error) {
    console.error("[v0] Invite member error:", error)
    return { error: "Failed to send invitation. Please try again." }
  }
}

export async function removeMember(groupId: number, memberId: string) {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  try {
    // Check if user is admin
    const membership = await sql`
      SELECT role FROM jamii.group_members
      WHERE group_id = ${groupId} AND user_id = ${user.id} AND status = 'active'
    `

    if (membership.length === 0 || membership[0].role !== "admin") {
      return { error: "You do not have permission to remove members" }
    }

    // Cannot remove yourself if you're the creator
    const group = await sql`
      SELECT created_by FROM jamii.groups WHERE id = ${groupId}
    `

    if (group[0].created_by === memberId) {
      return { error: "Cannot remove the group creator" }
    }

    await sql`
      UPDATE jamii.group_members
      SET status = 'removed'
      WHERE group_id = ${groupId} AND user_id = ${memberId}
    `

    revalidatePath(`/dashboard/groups/${groupId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Remove member error:", error)
    return { error: "Failed to remove member. Please try again." }
  }
}
