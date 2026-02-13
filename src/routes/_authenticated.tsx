import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/signin" });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return null;

  return <Outlet />;
}
