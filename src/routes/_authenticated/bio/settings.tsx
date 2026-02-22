import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { useState } from "react"
import z from "zod"
import { FileUpload } from "@/components/file-upload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/_authenticated/bio/settings")({
  component: RouteComponent,
  ssr: false,
})

const profileHeaderSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  bio: z.string().trim().min(2, "Bio must be at least 2 characters"),
})

type ProfileHeaderValues = z.infer<typeof profileHeaderSchema>

function RouteComponent() {
  const { profileId } = useLoaderData({ from: "/_authenticated/bio" })
  const profile = useQuery(api.profiles.queries.getProfile, {})

  if (!profile) {
    return (
      <div className="text-sm text-muted-foreground">Loading profile...</div>
    )
  }

  return <SettingsForm profileId={profileId} profile={profile} />
}

export type Profile = FunctionReturnType<typeof api.profiles.getProfile>

function SettingsForm({
  profileId,
  profile,
}: {
  profileId: Id<"profiles">
  profile: Profile
}) {
  const updateProfileHeader = useMutation(
    api.profiles.mutations.updateProfileHeader,
  )
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const updateProfileAvatar = useMutation(
    api.profiles.mutations.updateProfileAvatar,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const normalizeValues = (
    values: ProfileHeaderValues,
  ): ProfileHeaderValues => ({
    username: values.username.trim(),
    title: values.title.trim(),
    bio: values.bio.trim(),
  })

  const form = useForm({
    defaultValues: {
      username: profile.username,
      title: profile.title,
      bio: profile.bio,
    },
    validators: {
      onSubmit: profileHeaderSchema,
    },
    onSubmit: async ({ value }) => {
      const normalizedValue = normalizeValues(value)
      setIsSaving(true)
      setSaveError(null)

      try {
        await updateProfileHeader({
          profileId,
          username: normalizedValue.username,
          title: normalizedValue.title,
          bio: normalizedValue.bio,
        })
        form.reset(normalizedValue)
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : "Failed to update profile",
        )
      } finally {
        setIsSaving(false)
      }
    },
  })

  const handleAvatarUpload = async (file: File) => {
    const uploadUrl = await generateUploadUrl({})

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })

    const { storageId } = await result.json()

    await updateProfileAvatar({ avatarId: storageId, profileId })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile header</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <FileUpload onChange={(_tempUrl, file) => handleAvatarUpload(file)}>
              <Avatar size="lg" className="group overflow-hidden">
                {profile.avatarUrl ? (
                  <AvatarImage src={profile.avatarUrl} />
                ) : (
                  <AvatarFallback />
                )}
                <div className="absolute inset-0 bg-primary/40 opacity-0 flex items-center justify-center text-primary-foreground group-hover:opacity-100 duration-200">
                  <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                </div>
              </Avatar>
            </FileUpload>

            <form.Field name="username">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Username</FieldLabel>
                    <Input
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
                        Your public page URL uses this username.
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

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
                      placeholder="John Labrador"
                    />

                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : (
                      <FieldDescription>
                        This appears under your avatar on the public page.
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="bio">
              {(field) => {
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
                        A short summary visitors see on your profile.
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            {saveError && (
              <p className="text-sm text-destructive" role="alert">
                {saveError}
              </p>
            )}

            <Field orientation="horizontal">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save profile"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
