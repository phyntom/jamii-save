import {
  House,
  DollarSign,
  PiggyBank,
  PanelsTopLeft,
  FileText,
  Users,
  CreditCard,
  SquareUser,
  Shield,
  Receipt,
  LogOut
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { signOut } from '@/app/actions/auth';

const menuItems = [
  {
    title: 'Dashboard',
    url: '#',
    icon: House,
  },
  {
    title: 'Contributions',
    url: '#',
    icon: PiggyBank,
  },
  {
    title: 'Loans',
    url: '#',
    icon: DollarSign,
  },
  {
    title: 'Projects',
    url: '#',
    icon: PanelsTopLeft,
  },
  {
    title: 'Expenses',
    url: '#',
    icon: Receipt,
  },
  {
    title: 'Documents',
    url: '#',
    icon: FileText,
  },
  {
    title: 'Members',
    url: '#',
    icon: Users,
  }
]



export function AppSidebar() {
  return (
    <Sidebar collapsible='offcanvas' className='h-screen sticky top-0'>
      <SidebarHeader></SidebarHeader>
      <SidebarContent className='overflow-y-auto'>
        {/* Main menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* subscription */}
        <SidebarGroup>
          <SidebarGroupLabel>Subscription</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <CreditCard />
                    <span>Plan & Pricing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <SquareUser />
                    <span>My profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <Button variant="destructive" type='submit' className='w-full'>
                <LogOut /> Sign out
              </Button>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
