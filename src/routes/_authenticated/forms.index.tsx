import { api } from "@convex/_generated/api"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import z from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/_authenticated/forms/")({
  component: RouteComponent,
})

const createFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string(),
})

function RouteComponent() {
  const navigate = useNavigate()
  const forms = useQuery(api.forms.getUserForms, {})
  const createForm = useMutation(api.forms.createForm)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: createFormSchema,
    },
    onSubmit: async ({ value }) => {
      setIsCreating(true)
      try {
        const formId = await createForm({
          title: value.title.trim(),
          description: value.description.trim() || undefined,
          fields: [],
        })

        setIsSheetOpen(false)
        navigate({
          to: "/forms/$id/settings",
          params: { id: formId },
        })
      } finally {
        setIsCreating(false)
      }
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Manage form definitions and review submissions.
          </p>
          <Badge variant="outline">{forms?.length ?? 0} forms</Badge>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => setIsSheetOpen(true)}
        >
          Create form
        </Button>
      </div>

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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[560px]">
          <SheetHeader>
            <SheetTitle>Create form</SheetTitle>
            <SheetDescription>
              Set a title and optional description to get started.
            </SheetDescription>
          </SheetHeader>

          <form
            className="flex-1 overflow-y-auto px-6 pb-6"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field name="title">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Title</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Contact form"
                      />
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <FieldDescription>
                          A clear title helps people understand this form.
                        </FieldDescription>
                      )}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="description">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Optional description"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              </form.Field>

              <Field orientation="horizontal">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create form"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
