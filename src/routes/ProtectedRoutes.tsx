import { Spinner } from "@/components/ui/spinner";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoutes() {
  const location = useLocation();

  // During OAuth callback, the URL has a `code` param.
  // Don't redirect yet — let Convex finish processing the token.
  const isOAuthCallback =
    location.search.includes("code=") || location.search.includes("state=");

  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="size-3" />
        </div>
      </AuthLoading>
      <Authenticated>
        <Outlet />
      </Authenticated>
      <Unauthenticated>
        {isOAuthCallback ? (
          <div className="flex min-h-screen items-center justify-center">
            <Spinner className="size-3" />
          </div>
        ) : (
          <Navigate
            to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`}
            replace
          />
        )}
      </Unauthenticated>
    </>
  );
}
