import { ConvexHttpClient } from "convex/browser"

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL
if (!CONVEX_URL) {
  console.error("missing envar CONVEX_URL")
}
export const convexHttpClient = new ConvexHttpClient(CONVEX_URL)
