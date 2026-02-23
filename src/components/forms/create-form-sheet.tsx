import { api } from "@convex/_generated/api"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { useState } from "react"
import z from "zod"
import { Button } from "../ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field"
import { Input } from "../ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import { Textarea } from "../ui/textarea"

const createFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string(),
})

export function CreateFormSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const createForm = useMutation(api.forms.mutations.createForm)
  const navigate = useNavigate()
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

        onClose()
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-140">
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
  )
}
