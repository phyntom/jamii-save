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
  IconLayoutDashboard,
  IconWallet,
  IconCoins,
  IconUsers,
  IconClipboardCheck,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconHelpCircle,
  IconCalendar,
  IconSitemap,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Doc, Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface Props {
  community: Doc<"communities">;
  role: string;
}

const MEMBER_NAV = [
  {
    label: "Overview",
    icon: IconLayoutDashboard,
    path: "", // /communities/:slug
  },
  {
    label: "My contributions",
    icon: IconWallet,
    path: "/contribute",
  },
  {
    label: "Request a loan",
    icon: IconCoins,
    path: "/request",
    disabled: true, // future feature
  },
  {
    label: "Get help",
    icon: IconHelpCircle,
    path: "/admin/help",
  },
  {
    label: "Payment Schedule",
    icon: IconCalendar,
    path: "/payment-schedule",
  },
];

const ADMIN_NAV = [
  {
    label: "Community settings",
    icon: IconSitemap,
    path: "/admin/edit",
  },
  {
    label: "Members",
    icon: IconUsers,
    path: "/admin/members",
  },
  {
    label: "Contributions",
    icon: IconClipboardCheck,
    path: "/admin/contributions",
    badge: "pending", // we'll pass the count dynamically later
  },
  {
    label: "Settings",
    icon: IconSettings,
    path: "/admin/settings",
  },
  {
    label: "Get help",
    icon: IconHelpCircle,
    path: "/admin/help",
  },
];

export function MainSidebar({ community, role }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuthActions();
  const logoUrl = useQuery(api.communities.getLogoUrl, {
    storageId: community.logo as Id<"_storage"> | undefined,
  });

  console.log("logoUrl", logoUrl);

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
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={community.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                    loading="lazy"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-sm truncate">
                  {community.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  @{community.slug}
                </span>
              </div>
              <IconChevronRight className="ml-auto w-4 h-4 text-muted-foreground" />
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
              <IconLogout className="w-4 h-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
