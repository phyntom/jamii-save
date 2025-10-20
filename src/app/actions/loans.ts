'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSession } from '@/app/actions/auth';
import { sql } from '@/lib/db';

const requestLoanSchema = z.object({
  groupId: z.string(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  repaymentMonths: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Repayment period must be a positive number',
  }),
});

const approveLoanSchema = z.object({
  loanId: z.string(),
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

const recordRepaymentSchema = z.object({
  loanId: z.string(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'mobile_money', 'card']),
  referenceNumber: z.string().optional(),
});

export async function requestLoan(formData: FormData) {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const data = {
    groupId: formData.get('groupId') as string,
    amount: formData.get('amount') as string,
    purpose: formData.get('purpose') as string,
    repaymentMonths: formData.get('repaymentMonths') as string,
  };

  const validation = requestLoanSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { groupId, amount, purpose, repaymentMonths } = validation.data;

  try {
    // Check if user is a member of the group
    const membership = await sql`
      SELECT id FROM jamii.group_members
      WHERE group_id = ${Number(groupId)} AND user_id = ${user.id} AND status = 'active'
    `;

    if (membership.length === 0) {
      return { error: 'You are not a member of this group' };
    }

    // Get group loan settings
    const groups = await sql`
      SELECT max_loan_amount, loan_interest_rate
      FROM jamii.groups
      WHERE id = ${Number(groupId)}
    `;

    const group = groups[0];

    if (group.max_loan_amount && Number(amount) > Number(group.max_loan_amount)) {
      return {
        error: `Loan amount exceeds the maximum of $${Number(group.max_loan_amount).toFixed(2)}`,
      };
    }

    // Check for existing active loans
    const existingLoans = await sql`
      SELECT id FROM jamii.loans
      WHERE user_id = ${user.id} AND group_id = ${Number(groupId)} 
      AND status IN ('pending', 'approved', 'active')
    `;

    if (existingLoans.length > 0) {
      return {
        error: 'You already have an active or pending loan in this group',
      };
    }

    // Calculate loan details
    const principal = Number(amount);
    const interestRate = Number(group.loan_interest_rate) / 100;
    const months = Number(repaymentMonths);
    const interest = principal * interestRate * (months / 12);
    const totalAmount = principal + interest;
    const monthlyPayment = totalAmount / months;

    // Create loan request
    await sql`
      INSERT INTO jamii.loans (
        group_id, user_id, amount, interest_rate, 
        repayment_months, total_amount, monthly_payment,
        purpose, status
      )
      VALUES (
        ${Number(groupId)},
        ${user.id},
        ${principal},
        ${Number(group.loan_interest_rate)},
        ${months},
        ${totalAmount},
        ${monthlyPayment},
        ${purpose},
        'pending'
      )
    `;

    revalidatePath(`/dashboard/groups/${groupId}/loans`);
    revalidatePath('/dashboard/loans');
    return {
      success: true,
      message: 'Loan request submitted successfully. Awaiting admin approval.',
    };
  } catch (error) {
    console.error('[v0] Request loan error:', error);
    return { error: 'Failed to submit loan request. Please try again.' };
  }
}

export async function approveLoan(formData: FormData) {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const data = {
    loanId: formData.get('loanId') as string,
    action: formData.get('action') as string,
    notes: formData.get('notes') as string,
  };

  const validation = approveLoanSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { loanId, action, notes } = validation.data;

  try {
    // Get loan details
    const loans = await sql`
      SELECT l.*, g.id as group_id
      FROM jamii.loans l
      JOIN jamii.groups g ON l.group_id = g.id
      WHERE l.id = ${Number(loanId)}
    `;

    if (loans.length === 0) {
      return { error: 'Loan not found' };
    }

    const loan = loans[0];

    // Check if user is admin of the group
    const membership = await sql`
      SELECT role FROM jamii.group_members
      WHERE group_id = ${loan.group_id} AND user_id = ${user.id} AND status = 'active'
    `;

    if (membership.length === 0 || membership[0].role !== 'admin') {
      return { error: 'You do not have permission to approve loans' };
    }

    // Update loan status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await sql`
      UPDATE jamii.loans
      SET 
        status = ${newStatus},
        approved_by = ${user.id},
        approved_at = NOW(),
        disbursed_at = ${action === 'approve' ? 'NOW()' : null},
        notes = ${notes || null},
        updated_at = NOW()
      WHERE id = ${Number(loanId)}
    `;

    // Log the action
    await sql`
      INSERT INTO jamii.audit_logs (user_id, action, entity_type, entity_id, changes)
      VALUES (
        ${user.id},
        ${action === 'approve' ? 'approve_loan' : 'reject_loan'},
        'loan',
        ${loanId},
        ${JSON.stringify({ status: newStatus, notes })}::jsonb
      )
    `;

    revalidatePath(`/dashboard/groups/${loan.group_id}/loans`);
    revalidatePath('/dashboard/loans');
    return { success: true, message: `Loan ${action}d successfully` };
  } catch (error) {
    console.error('[v0] Approve loan error:', error);
    return { error: 'Failed to process loan. Please try again.' };
  }
}

export async function recordRepayment(formData: FormData) {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const data = {
    loanId: formData.get('loanId') as string,
    amount: formData.get('amount') as string,
    paymentMethod: formData.get('paymentMethod') as string,
    referenceNumber: formData.get('referenceNumber') as string,
  };

  const validation = recordRepaymentSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { loanId, amount, paymentMethod, referenceNumber } = validation.data;

  try {
    // Get loan details
    const loans = await sql`
      SELECT l.*, 
        COALESCE(SUM(lr.amount), 0) as total_repaid
      FROM jamii.loans l
      LEFT JOIN jamii.loan_repayments lr ON l.id = lr.loan_id AND lr.status = 'approved'
      WHERE l.id = ${Number(loanId)} AND l.user_id = ${user.id}
      GROUP BY l.id
    `;

    if (loans.length === 0) {
      return { error: 'Loan not found' };
    }

    const loan = loans[0];
    const totalRepaid = Number(loan.total_repaid);
    const remainingBalance = Number(loan.total_amount) - totalRepaid;

    if (Number(amount) > remainingBalance) {
      return {
        error: `Payment amount exceeds remaining balance of $${remainingBalance.toFixed(2)}`,
      };
    }

    // Record repayment
    await sql`
      INSERT INTO jamii.loan_repayments (
        loan_id, amount, payment_method, reference_number, status
      )
      VALUES (
        ${Number(loanId)},
        ${Number(amount)},
        ${paymentMethod},
        ${referenceNumber || null},
        'pending'
      )
    `;

    revalidatePath(`/dashboard/loans/${loanId}`);
    revalidatePath('/dashboard/loans');
    return {
      success: true,
      message: 'Repayment recorded successfully. Awaiting admin approval.',
    };
  } catch (error) {
    console.error('[v0] Record repayment error:', error);
    return { error: 'Failed to record repayment. Please try again.' };
  }
}
