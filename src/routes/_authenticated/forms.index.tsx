import { api } from "@convex/_generated/api"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "convex/react"

export const Route = createFileRoute("/_authenticated/forms/")({
  component: RouteComponent,
})

function RouteComponent() {
  const forms = useQuery(api.forms.getUserForms, {})

  return (
    <div>
      {forms?.map((form) => (
        <Link to="/forms/$id" params={{ id: form._id }} key={form._id}>
          {form.title} {form.description}
        </Link>
      ))}
    </div>
  )
}
