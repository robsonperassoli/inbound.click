import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { useMemo } from "react"
import { PageTitle } from "@/components/page-title"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute("/_authenticated/forms/$id")({
  component: RouteComponent,
  params: {
    parse: (params) => ({
      id: params.id as Id<"forms">,
    }),
  },
})

function RouteComponent() {
  const { id: formId } = Route.useParams()
  const { pathname } = useLocation()
  const form = useQuery(api.forms.getUserForm, {
    formId,
  })

  const activeTab = useMemo(
    () => (pathname.includes("/settings") ? "settings" : "submissions"),
    [pathname],
  )

  return (
    <div className="p-6 space-y-4">
      <PageTitle
        title={form?.title ?? "Form"}
        description={form?.description}
      />

      <Tabs value={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="submissions" asChild>
            <Link
              to="/forms/$id/submissions"
              params={{ id: formId }}
              activeOptions={{ exact: true }}
              activeProps={{ className: "data-[state=active]" }}
            >
              Submissions
            </Link>
          </TabsTrigger>

          <TabsTrigger value="settings" asChild>
            <Link
              to="/forms/$id/settings"
              params={{ id: formId }}
              activeOptions={{ exact: true }}
              activeProps={{ className: "data-[state=active]" }}
            >
              Settings
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Outlet />
    </div>
  )
}
