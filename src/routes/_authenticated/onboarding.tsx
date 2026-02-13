import { api } from "@convex/_generated/api"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getDefaultTheme } from "@/lib/themes"

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: RouteComponent,
  ssr: false,
})

const formSchema = z.object({
  username: z.string().min(3).max(30),
  title: z.string().min(2).max(100),
  bio: z.string().min(2).max(500),
})

function RouteComponent() {
  const navigate = useNavigate()
  const createProfileMutation = useMutation(api.profiles.createProfile)
  const form = useForm({
    defaultValues: {
      username: "",
      title: "",
      bio: "",
    },
    onSubmit: async ({ value }) => {
      const defaultTheme = getDefaultTheme()
      await createProfileMutation({
        username: value.username,
        title: value.title,
        bio: value.bio,
        theme: defaultTheme.name,
        backgroundColor: defaultTheme.backgroundColor,
        backgroundImage: undefined,
        fontFamily: defaultTheme.fontFamily,
        textColor: defaultTheme.textColor,
        buttonShape: defaultTheme.buttonShape,
        buttonStyle: defaultTheme.buttonStyle,
        buttonColor: defaultTheme.buttonColor,
        buttonTextColor: defaultTheme.buttonTextColor,
      })

      navigate({ to: "/dashboard" })
    },
    validators: {
      onSubmit: formSchema,
    },
  })

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Inbound Click!</DialogTitle>
          <DialogDescription>
            Get started by setting up your profile.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="username"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Username</FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="the_real_john"
                      autoComplete="off"
                    />

                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : (
                      <FieldDescription>
                        Choose a unique handle for your url
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Labrador"
                    />

                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : (
                      <FieldDescription>
                        Set a title for your page
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="bio"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Bio</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Making dreams come true"
                    />

                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : (
                      <FieldDescription>
                        Set a bio text to impress your visitors
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <Field className="mt-6">
            <Button type="submit">
              Continue <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
            </Button>
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  )
}
