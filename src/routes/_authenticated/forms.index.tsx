import { api } from "@convex/_generated/api"
import { ChevronDown, PlusSignIcon, Sparkles } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { useMemo, useState } from "react"
import { CreateFormPrompt } from "@/components/forms/create-form-prompt"
import { CreateFormSheet } from "@/components/forms/create-form-sheet"
import { useSiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute("/_authenticated/forms/")({
  component: RouteComponent,
})

function RouteComponent() {
  const headerActions = useMemo(
    () => [
      <ButtonGroup>
        <Button size="sm" onClick={() => setOpenDialog("prompt-create")}>
          <HugeiconsIcon icon={Sparkles} /> Create Form
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="!pl-2" size="sm">
              <HugeiconsIcon icon={ChevronDown} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setOpenDialog("manual-create")}>
                Create manually
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>,
    ],
    [],
  )

  useSiteHeader({ title: "Forms", actions: headerActions })

  const forms = useQuery(api.forms.queries.getUserForms, {})

  const [openDialog, setOpenDialog] = useState<
    null | "manual-create" | "prompt-create"
  >(null)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Your forms
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {forms === undefined && (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardContent className="py-8 text-sm text-muted-foreground">
                Loading forms…
              </CardContent>
            </Card>
          )}

          {forms?.length === 0 && (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardContent className="py-8">
                <p className="text-sm text-muted-foreground">
                  No forms yet. Create one to start collecting submissions.
                </p>
              </CardContent>
            </Card>
          )}

          {forms?.map((item) => (
            <Card
              key={item._id}
              className="group border-border/70 bg-card transition-shadow duration-200 hover:shadow-sm motion-safe:animate-in motion-safe:fade-in-0"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="line-clamp-2 min-w-0 text-base text-pretty">
                    {item.title}
                  </CardTitle>
                  <Badge variant="outline">{item.fields.length} fields</Badge>
                </div>

                <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                  {item.description || "No description"}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Updated{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(item.updatedAt)}
                </p>

                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Link to="/forms/$id/settings" params={{ id: item._id }}>
                      Edit
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="w-full">
                    <Link to="/forms/$id/submissions" params={{ id: item._id }}>
                      Submissions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateFormSheet
        open={openDialog === "manual-create"}
        onClose={() => setOpenDialog(null)}
      />

      <CreateFormPrompt
        open={openDialog === "prompt-create"}
        onClose={() => setOpenDialog(null)}
      />
    </div>
  )
}
