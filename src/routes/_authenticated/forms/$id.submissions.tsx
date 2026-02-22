import { api } from "@convex/_generated/api"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "convex/react"
import { useMemo } from "react"
import { DataTable } from "@/components/data-table"
import { useFormSubmissions } from "@/hooks/use-form-submissions"

export const Route = createFileRoute("/_authenticated/forms/$id/submissions")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id: formId } = Route.useParams()
  const form = useQuery(api.forms.queries.getUserForm, {
    formId,
  })
  const submissions = useFormSubmissions(formId)

  const columns: ColumnDef<(typeof submissions)[number]>[] = useMemo(() => {
    if (!form) {
      return []
    }

    return form.fields.map((f) => ({
      accessorKey: f.id,
      header: f.label,
      cell: ({ row }) => {
        return row.original.values[f.id] ?? "N/A"
      },
    }))
  }, [form])

  return (
    <div>
      <DataTable columns={columns} data={submissions} />
    </div>
  )
}
