"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Community } from "@/drizzle/schemas/community"
// import { InvitesTab } from "./invites-tab"
import { authClient } from "@/lib/auth-client"
import { MembersTab } from "./member-tab"
import { Mails, Users } from "lucide-react"
import { InvitesTab } from "./invitates-tab"

export function CommunityTabs() {
    const { data: activeCommunity } = authClient.useActiveOrganization();
    return (
        <div className="space-y-4">
            {activeCommunity && (
                <Tabs defaultValue="members" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-16">
                        <TabsTrigger
                            value="members"
                            className="data-[state=active]:bg-secondary-foreground  data-[state=active]:text-white"
                        >
                            <Users />Members
                        </TabsTrigger>
                        <TabsTrigger
                            value="invitations"
                            className="data-[state=active]:bg-secondary-foreground data-[state=active]:text-white"
                        >
                            <Mails />Invitations
                        </TabsTrigger>
                        <TabsTrigger
                            value="subscriptions"
                            className="data-[state=active]:bg-secondary-foreground data-[state=active]:text-white"
                        >
                            Subscriptions
                        </TabsTrigger>
                    </TabsList>
                    <Card>
                        <CardContent>
                            <TabsContent value="members">
                                <MembersTab />
                            </TabsContent>

                            <TabsContent value="invitations">
                                <InvitesTab />
                            </TabsContent>

                            <TabsContent value="subscriptions">
                                {/* <SubscriptionsTab /> */}
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            )}
        </div>
    )
}