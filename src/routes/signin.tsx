import { createFileRoute } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signIn } = useAuthActions();

  return (
    <div>
      <Button onClick={() => void signIn("github")}>Sign in with GitHub</Button>
    </div>
  );
}
