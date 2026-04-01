import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/invites/$token')({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/invitation/$token"!</div>
}
