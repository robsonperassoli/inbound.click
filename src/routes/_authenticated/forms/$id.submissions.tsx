import { api } from "@convex/_generated/api"
import { ChatSpark01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "convex/react"
import { useMemo } from "react"
import { DataTable } from "@/components/data-table"
import { useSiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { useFormSubmissions } from "@/hooks/use-form-submissions"

export const Route = createFileRoute("/_authenticated/forms/$id/submissions")({
  component: RouteComponent,
})

function RouteComponent() {
  useSiteHeader({ title: "Submissions", titleMode: "append" })

  const { id: formId } = Route.useParams()
  const form = useQuery(api.forms.queries.getUserForm, {
    formId,
  })
  const submissions = useFormSubmissions(formId)

  const columns: ColumnDef<(typeof submissions)[number]>[] = useMemo(() => {
    if (!form) {
      return []
    }

    const actionColumn: ColumnDef<(typeof submissions)[number]> = {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <Button asChild size="icon-sm" variant="secondary">
            <Link
              to="/forms/$id/submissions/$submissionId/transcript"
              params={{
                id: form._id,
                submissionId: row.original._id,
              }}
            >
              <HugeiconsIcon icon={ChatSpark01Icon} />
            </Link>
          </Button>
        )
      },
    }

    const dataColumns: ColumnDef<(typeof submissions)[number]>[] =
      form.fields.map((f) => ({
        accessorKey: f.id,
        header: f.label,
        cell: ({ row }) => {
          return row.original.values[f.id] ?? "N/A"
        },
      }))

    return [...dataColumns, actionColumn]
  }, [form])

  return (
    <div>
      <DataTable columns={columns} data={submissions} />
      <Outlet />
    </div>
  )
}
