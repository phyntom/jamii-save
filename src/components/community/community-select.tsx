"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export function CommunitySelect() {
    const { data: activeCommunity } = authClient.useActiveOrganization()
    const { data: userCommunities } = authClient.useListOrganizations()

    if (userCommunities == null || userCommunities.length === 0) {
        return null
    }

    async function setActiveOrganization(communityId: string) {
        const { error } = await authClient.organization.setActive({
            organizationId: communityId
        }, {
            onError: (ctx) => {
                toast.error(ctx.error.message || "Failed to switch community")
            }
        });
    }

    return (
        <Select
            value={activeCommunity?.id}
            onValueChange={setActiveOrganization}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a community" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {userCommunities.map(community => (
                        <SelectItem key={community.id} value={community.id}>
                            {community.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}