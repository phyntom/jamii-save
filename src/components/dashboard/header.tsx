'use client';

import Link from 'next/link';
import { getSession, signOut } from '@/server/authentication';
import { Logo } from '@/components/commons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { User } from '@/drizzle/schemas/auth';
import { LogOutIcon } from 'lucide-react';

export function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [initials, setInitials] = useState<string>('');

  async function handleSignOut() {
    const result = await authClient.signOut();
    if (result?.error) {
      toast.error(result.error.message);
    }
    toast.success('Signed out successfully');
    router.push('/');
  }

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (!session) {
        router.push('/');
      }
      if (session && session?.data) {
        setUser(session?.data?.user as User);
        setInitials(
          session?.data?.user?.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        );
      }
    });
  }, [router]);

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <Logo size="default" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-amber-500">
            Dashboard
          </Link>
          <Link href="/dashboard/community" className="text-sm font-medium hover:text-amber-500">
            Community
          </Link>
          <Link
            href="/dashboard/contributions"
            className="text-sm font-medium hover:text-amber-500"
          >
            Contributions
          </Link>
          <Link href="/dashboard/loans" className="text-sm font-medium hover:text-amber-500">
            Loans
          </Link>
        </nav>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button type="button" size="icon-sm" onClick={handleSignOut} variant="link" className="w-full justify-start">
                  Sign out
                  <LogOutIcon />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
