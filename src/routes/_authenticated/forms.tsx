import { api } from "@convex/_generated/api"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authenticated/forms")({
  component: RouteComponent,
})

function RouteComponent() {
  const createForm = useMutation(api.forms.createForm)

  return (
    <div>
      <Button
        onClick={async () => {
          await createForm({
            title: "New Form",
            fields: [
              {
                id: "first_name",
                label: "First Name",
                type: "shortText",
                required: true,
              },
              {
                id: "last_name",
                label: "Last Name",
                type: "shortText",
                required: true,
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                required: true,
              },
              {
                id: "phone",
                label: "Phone",
                type: "phoneNumber",
                required: true,
              },
            ],
          })
        }}
      >
        Create Form
      </Button>
    </div>
  )
}
