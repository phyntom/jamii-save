import { useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "./MainSidebar";

export default function MainLayout() {
  const { slug } = useParams<{ slug: string }>();

  const community = useQuery(
    api.communities.getBySlug,
    slug ? { slug } : "skip",
  );

  const membership = useQuery(
    api.memberships.getMyMembership,
    slug ? { slug } : "skip",
  );

  if (community === undefined || membership === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!community || !membership) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Community not found or you are not a member.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <MainSidebar community={community} role={membership.role} />
      <SidebarInset>
        <Outlet context={{ community, membership }} />
      </SidebarInset>
    </SidebarProvider>
  );
}
