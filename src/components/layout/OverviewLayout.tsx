import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useId } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function OverviewLayout() {
  const featuresId = useId();
  const pricingId = useId();
  const testimonialsId = useId();
  const user = useQuery(api.users.currentUser);
  const isLoggedIn = !!user;
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/sign-in");
  }
  return (
    <>
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </div>
            {!isLoggedIn && (
              <div className="hidden md:flex items-center space-x-8">
                <NavLink
                  to={`#${featuresId}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Features
                </NavLink>
                <NavLink
                  to={`#${pricingId}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </NavLink>
                <NavLink
                  to={`#${testimonialsId}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Testimonials
                </NavLink>
              </div>
            )}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Button variant="ghost" onClick={async () => handleSignOut()}>
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost">Sign In</Button>
              )}
              {isLoggedIn && (
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="grayscale"
                  />
                  <AvatarFallback></AvatarFallback>
                  <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
