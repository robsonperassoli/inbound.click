import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { convexQueryClient } from "./integrations/convex/provider";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      convex: convexQueryClient.convexClient,
    },
  });

  return router;
}
