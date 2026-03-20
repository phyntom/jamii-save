import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  PiggyBank,
  HandCoins,
  Users,
  ClipboardCheck,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Doc } from "../../../convex/_generated/dataModel";

interface Props {
  community: Doc<"communities">;
  role: string;
}

const MEMBER_NAV = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    path: "", // /communities/:slug
  },
  {
    label: "My contributions",
    icon: PiggyBank,
    path: "/contribute",
  },
  {
    label: "Request a loan",
    icon: HandCoins,
    path: "/request",
    disabled: true, // future feature
  },
];

const ADMIN_NAV = [
  {
    label: "Members",
    icon: Users,
    path: "/admin/members",
  },
  {
    label: "Contributions",
    icon: ClipboardCheck,
    path: "/admin/contributions",
    badge: "pending", // we'll pass the count dynamically later
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export function MainSidebar({ community, role }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuthActions();

  const isAdmin = role === "owner" || role === "admin";
  const base = `/communities/${community.slug}`;

  function isActive(path: string) {
    const full = base + path;
    return path === ""
      ? location.pathname === full
      : location.pathname.startsWith(full);
  }

  const initials = community.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Sidebar>
      {/* Community identity */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate("/overview")}
              tooltip="Back to dashboard"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono flex-shrink-0">
                {initials}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-sm truncate">
                  {community.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  @{community.slug}
                </span>
              </div>
              <ChevronRight className="ml-auto w-4 h-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Member section — visible to everyone */}
        <SidebarGroup>
          <SidebarGroupLabel>My space</SidebarGroupLabel>
          <SidebarMenu>
            {MEMBER_NAV.map(({ label, icon: Icon, path, disabled }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton
                  isActive={isActive(path)}
                  disabled={disabled}
                  onClick={() => !disabled && navigate(base + path)}
                  tooltip={disabled ? "Coming soon" : label}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {disabled && (
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      soon
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Admin section — owner and admin only */}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarMenu>
                {ADMIN_NAV.map(({ label, icon: Icon, path, badge }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      isActive={isActive(path)}
                      onClick={() => navigate(base + path)}
                      tooltip={label}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {badge && <SidebarMenuBadge>3</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
