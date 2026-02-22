import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/forms/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/forms/create"!</div>
}
