"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { InviteMemberButton } from "./invite-member-button"

export function InvitesTab() {
    const { data: activeCommunity } = authClient.useActiveOrganization()
    const pendingInvites = activeCommunity?.invitations?.filter(
        invite => invite.status === "pending"
    )

    function cancelInvitation(invitationId: string) {
        return authClient.organization.cancelInvitation({ invitationId })
    }

    return (
        <div className="space-y-4">
            <div className="justify-end flex">
                <InviteMemberButton communityId={activeCommunity?.id!} />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pendingInvites?.map(invitation => (
                        <TableRow key={invitation.id}>
                            <TableCell>{invitation.email}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{invitation.role}</Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(invitation.expiresAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {invitation.status === "pending" ? (
                                    <Badge variant="secondary">Pending</Badge>
                                ) : (
                                    <Badge variant="default">{invitation.status}</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => cancelInvitation(invitation.id)}
                                >
                                    Cancel
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}