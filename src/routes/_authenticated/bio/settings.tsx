import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/bio/settings")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return <div>Change page title, bio, username and avatar picture</div>
}
