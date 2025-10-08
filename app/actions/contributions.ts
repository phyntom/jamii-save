"use server"

import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const recordContributionSchema = z.object({
  groupId: z.string(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  paymentMethod: z.enum(["cash", "bank_transfer", "mobile_money", "card"]),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
})

const approveContributionSchema = z.object({
  contributionId: z.string(),
  action: z.enum(["approve", "reject"]),
  notes: z.string().optional(),
})

export async function recordContribution(formData: FormData) {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  const data = {
    groupId: formData.get("groupId") as string,
    amount: formData.get("amount") as string,
    paymentMethod: formData.get("paymentMethod") as string,
    referenceNumber: formData.get("referenceNumber") as string,
    notes: formData.get("notes") as string,
  }

  const validation = recordContributionSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { groupId, amount, paymentMethod, referenceNumber, notes } = validation.data

  try {
    // Check if user is a member of the group
    const membership = await sql`
      SELECT id FROM jamii.group_members
      WHERE group_id = ${Number(groupId)} AND user_id = ${user.id} AND status = 'active'
    `

    if (membership.length === 0) {
      return { error: "You are not a member of this group" }
    }

    // Record the contribution
    await sql`
      INSERT INTO jamii.contributions (
        group_id, user_id, amount, payment_method, 
        reference_number, notes, status
      )
      VALUES (
        ${Number(groupId)},
        ${user.id},
        ${Number(amount)},
        ${paymentMethod},
        ${referenceNumber || null},
        ${notes || null},
        'pending'
      )
    `

    revalidatePath(`/dashboard/groups/${groupId}/contributions`)
    revalidatePath("/dashboard/contributions")
    return { success: true, message: "Contribution recorded successfully. Awaiting admin approval." }
  } catch (error) {
    console.error("[v0] Record contribution error:", error)
    return { error: "Failed to record contribution. Please try again." }
  }
}

export async function approveContribution(formData: FormData) {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  const data = {
    contributionId: formData.get("contributionId") as string,
    action: formData.get("action") as string,
    notes: formData.get("notes") as string,
  }

  const validation = approveContributionSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { contributionId, action, notes } = validation.data

  try {
    // Get contribution details
    const contributions = await sql`
      SELECT c.*, g.id as group_id
      FROM jamii.contributions c
      JOIN jamii.groups g ON c.group_id = g.id
      WHERE c.id = ${Number(contributionId)}
    `

    if (contributions.length === 0) {
      return { error: "Contribution not found" }
    }

    const contribution = contributions[0]

    // Check if user is admin of the group
    const membership = await sql`
      SELECT role FROM jamii.group_members
      WHERE group_id = ${contribution.group_id} AND user_id = ${user.id} AND status = 'active'
    `

    if (membership.length === 0 || membership[0].role !== "admin") {
      return { error: "You do not have permission to approve contributions" }
    }

    // Update contribution status
    const newStatus = action === "approve" ? "approved" : "rejected"
    await sql`
      UPDATE jamii.contributions
      SET 
        status = ${newStatus},
        approved_by = ${user.id},
        approved_at = NOW(),
        notes = CASE 
          WHEN ${notes || null} IS NOT NULL THEN ${notes}
          ELSE notes
        END,
        updated_at = NOW()
      WHERE id = ${Number(contributionId)}
    `

    // Log the action
    await sql`
      INSERT INTO jamii.audit_logs (user_id, action, entity_type, entity_id, changes)
      VALUES (
        ${user.id},
        ${action === "approve" ? "approve_contribution" : "reject_contribution"},
        'contribution',
        ${contributionId},
        ${JSON.stringify({ status: newStatus, notes })}::jsonb
      )
    `

    revalidatePath(`/dashboard/groups/${contribution.group_id}/contributions`)
    revalidatePath("/dashboard/contributions")
    return { success: true, message: `Contribution ${action}d successfully` }
  } catch (error) {
    console.error("[v0] Approve contribution error:", error)
    return { error: "Failed to process contribution. Please try again." }
  }
}
