import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/upgrade')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/upgrade"!</div>
}
