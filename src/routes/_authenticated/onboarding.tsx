import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAction, useConvex, useMutation } from "convex/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { FileUpload } from "@/components/file-upload"
import { BIO_DOMAIN } from "@/components/share-button"
import { useSiteHeader } from "@/components/site-header"
import { ThemePreview } from "@/components/theme-preview"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { UserPage } from "@/components/user-page"
import { useFileUpload } from "@/hooks/use-file-upload"
import {
  buildSocialLinks,
  normalizeSocialHandle,
  type SocialHandles,
  socialConfig,
} from "@/lib/social-links"
import { basicThemes, getDefaultTheme } from "@/lib/themes"

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: RouteComponent,
  ssr: false,
})

const stepOneSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Use letters, numbers, underscores, and hyphens only",
    ),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  bio: z.string().trim().min(2, "Bio must be at least 2 characters"),
})

type OnboardingStep = 1 | 2 | 3
type UsernameStatus = "idle" | "checking" | "available" | "taken" | "error"
type StepOneErrors = Partial<Record<"username" | "title" | "bio", string>>

const stepItems: Array<{ step: OnboardingStep; label: string }> = [
  { step: 1, label: "Basic Profile" },
  { step: 2, label: "Social Handles" },
  { step: 3, label: "Appearance" },
]

const stepContent: Record<OnboardingStep, { title: string; subtitle: string }> =
  {
    1: {
      title: "Welcome to Inbound Click!",
      subtitle:
        "Set up your basic profile details. You can change everything later.",
    },
    2: {
      title: "Add your social handles",
      subtitle:
        "This step is optional. We will turn handles into buttons on your page.",
    },
    3: {
      title: "Customize appearance",
      subtitle:
        "Pick a starting theme now and fine-tune it later from Appearance settings.",
    },
  }

const emptySocialHandles: SocialHandles = {
  instagram: "",
  tiktok: "",
  facebook: "",
  linkedin: "",
  youtube: "",
}

function RouteComponent() {
  useSiteHeader({ title: "Onboarding" })

  const navigate = useNavigate()
  const convex = useConvex()
  const { uploadFile, uploading } = useFileUpload()
  const getFileUrl = useAction(api.files.getFileUrl)
  const createProfileMutation = useMutation(
    api.profiles.mutations.createProfile,
  )
  const defaultTheme = getDefaultTheme()

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [username, setUsername] = useState("")
  const [usernameBlurred, setUsernameBlurred] = useState(false)
  const [hasAttemptedStepOneContinue, setHasAttemptedStepOneContinue] =
    useState(false)
  const [title, setTitle] = useState("")
  const [bio, setBio] = useState("")
  const [stepOneErrors, setStepOneErrors] = useState<StepOneErrors>({})
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle")
  const [lastCheckedUsername, setLastCheckedUsername] = useState("")
  const [socialHandles, setSocialHandles] =
    useState<SocialHandles>(emptySocialHandles)
  const [selectedThemeName, setSelectedThemeName] = useState(defaultTheme.name)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [avatarStorageId, setAvatarStorageId] = useState<Id<"_storage"> | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const requestRef = useRef(0)

  const normalizedUsername = username.trim()

  const selectedTheme = useMemo(
    () =>
      basicThemes.find((theme) => theme.name === selectedThemeName) ??
      defaultTheme,
    [defaultTheme, selectedThemeName],
  )

  const socialLinks = useMemo(
    () =>
      buildSocialLinks({
        instagram: socialHandles.instagram,
        tiktok: socialHandles.tiktok,
        facebook: socialHandles.facebook,
        linkedin: socialHandles.linkedin,
        youtube: socialHandles.youtube,
      }),
    [socialHandles],
  )

  const previewLinks = useMemo(() => {
    if (socialLinks.length === 0) {
      const placeholderTitles = ["Get in Touch", "Instagram", "Tiktok"]
      return placeholderTitles.map((title, index) => ({
        _id: `placeholder-link-${index}`,
        type: "form" as const,
        title,
      }))
    }

    return socialLinks.map((link, index) => ({
      _id: `social-link-${index}`,
      type: "url" as const,
      title: link.title,
      url: link.url,
    }))
  }, [socialLinks])

  const usernameError =
    stepOneSchema.shape.username.safeParse(normalizedUsername).error?.issues[0]
      ?.message

  const checkUsernameAvailability = useCallback(
    async (value: string) => {
      const normalized = value.trim()
      if (!normalized || usernameError) {
        setUsernameStatus("idle")
        return false
      }

      const requestId = ++requestRef.current
      setUsernameStatus("checking")

      try {
        const available = await convex.query(
          api.profiles.queries.isUsernameAvailable,
          {
            username: normalized,
          },
        )

        if (requestId !== requestRef.current) {
          return false
        }

        setLastCheckedUsername(normalized)
        setUsernameStatus(available ? "available" : "taken")
        return available
      } catch {
        if (requestId !== requestRef.current) {
          return false
        }

        setUsernameStatus("error")
        return false
      }
    },
    [convex, usernameError],
  )

  useEffect(() => {
    if (!normalizedUsername || usernameError) {
      setUsernameStatus("idle")
      return
    }

    const timeout = setTimeout(() => {
      void checkUsernameAvailability(normalizedUsername)
    }, 400)

    return () => clearTimeout(timeout)
  }, [checkUsernameAvailability, normalizedUsername, usernameError])

  const validateStepOne = () => {
    const result = stepOneSchema.safeParse({ username, title, bio })
    if (result.success) {
      setStepOneErrors({})
      return true
    }

    const errors: StepOneErrors = {}

    for (const issue of result.error.issues) {
      const field = issue.path[0]
      if (field === "username" || field === "title" || field === "bio") {
        errors[field] = issue.message
      }
    }

    setStepOneErrors(errors)
    return false
  }

  const advanceFromStepOne = async () => {
    setHasAttemptedStepOneContinue(true)

    const isValid = validateStepOne()
    if (!isValid) {
      return
    }

    const available = await checkUsernameAvailability(normalizedUsername)
    if (!available) {
      setStepOneErrors((current) => ({
        ...current,
        username:
          usernameStatus === "error"
            ? "Could not verify username availability right now"
            : "Username is already taken",
      }))
      return
    }

    setStepOneErrors((current) => ({ ...current, username: undefined }))
    setCurrentStep(2)
  }

  const handleAvatarUpload = async (tempUrl: string, file: File) => {
    const uploadResult = await uploadFile(file)
    if (!uploadResult?.storageId) {
      toast.error("Avatar upload failed. You can continue without an avatar.")
      setAvatarStorageId(null)
      return
    }

    const storageId = uploadResult.storageId as Id<"_storage">
    setAvatarStorageId(storageId)

    const fileUrl = await getFileUrl({ storageId })
    setAvatarPreviewUrl(fileUrl ?? tempUrl)
  }

  const submitOnboarding = async (themeName?: string) => {
    if (isSubmitting) {
      return
    }

    setHasAttemptedStepOneContinue(true)

    const validStepOne = validateStepOne()
    if (!validStepOne) {
      setCurrentStep(1)
      return
    }

    const available = await checkUsernameAvailability(normalizedUsername)
    if (!available) {
      setCurrentStep(1)
      setStepOneErrors((current) => ({
        ...current,
        username: "Username is already taken",
      }))
      return
    }

    const theme =
      basicThemes.find(
        (item) => item.name === (themeName ?? selectedThemeName),
      ) ?? defaultTheme

    setIsSubmitting(true)

    try {
      await createProfileMutation({
        username: normalizedUsername,
        title: title.trim(),
        bio: bio.trim(),
        avatarId: avatarStorageId ?? undefined,
        theme: theme.name,
        backgroundColor: theme.backgroundColor,
        backgroundImage: undefined,
        fontFamily: theme.fontFamily,
        textColor: theme.textColor,
        buttonShape: theme.buttonShape,
        buttonStyle: theme.buttonStyle,
        buttonColor: theme.buttonColor,
        buttonTextColor: theme.buttonTextColor,
        links: socialLinks,
      })

      navigate({ to: "/bio" })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create profile",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const usernameStatusText = useMemo(() => {
    if (stepOneErrors.username) {
      return stepOneErrors.username
    }

    if (!normalizedUsername) {
      return "Choose a unique handle for your URL."
    }

    if (usernameError) {
      return usernameBlurred || hasAttemptedStepOneContinue
        ? usernameError
        : "Use 3-30 characters with letters, numbers, _ or -."
    }

    if (usernameStatus === "checking") {
      return "Checking username availability..."
    }

    if (
      usernameStatus === "available" &&
      lastCheckedUsername === normalizedUsername
    ) {
      return "Username is available."
    }

    if (usernameStatus === "taken") {
      return "Username is already taken."
    }

    if (usernameStatus === "error") {
      return "Could not verify availability right now."
    }

    return "Choose a unique handle for your URL."
  }, [
    lastCheckedUsername,
    normalizedUsername,
    stepOneErrors.username,
    hasAttemptedStepOneContinue,
    usernameBlurred,
    usernameError,
    usernameStatus,
  ])

  const progressValue = useMemo(
    () => (currentStep / stepItems.length) * 100,
    [currentStep],
  )
  const currentStepContent = stepContent[currentStep]

  return (
    <Dialog open>
      <DialogContent
        className={currentStep === 3 ? "sm:max-w-3xl" : ""}
        showCloseButton={false}
      >
        <DialogHeader>
          <p className="text-xs font-medium text-muted-foreground">
            Step {currentStep} of {stepItems.length}
          </p>
          <DialogTitle>{currentStepContent.title}</DialogTitle>
          <DialogDescription>{currentStepContent.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="mt-6 mb-3 space-y-1.5">
          <ol className="grid grid-cols-3 gap-2 text-[11px] sm:text-xs">
            {stepItems.map((item) => (
              <li
                key={item.step}
                className={
                  item.step === currentStep
                    ? "text-primary font-medium"
                    : item.step < currentStep
                      ? "text-foreground/80 font-normal"
                      : "text-muted-foreground"
                }
              >
                {item.step}. {item.label}
              </li>
            ))}
          </ol>
          <Progress value={progressValue} className="h-1" />
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Avatar (Optional)</FieldLabel>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {avatarPreviewUrl && (
                      <Avatar size="lg">
                        <AvatarImage src={avatarPreviewUrl} />
                      </Avatar>
                    )}
                    <FileUpload
                      onChange={(tempUrl, file) =>
                        handleAvatarUpload(tempUrl, file)
                      }
                    >
                      <Button variant="outline" disabled={uploading}>
                        {uploading ? "Uploading..." : "Select image"}
                      </Button>
                    </FileUpload>
                  </div>
                  <FieldDescription>
                    Add a profile photo now, or update it later in settings.
                  </FieldDescription>
                </div>
              </Field>

              <Field data-invalid={Boolean(stepOneErrors.username)}>
                <FieldLabel>Username</FieldLabel>
                <InputGroup className="[--radius:9999px]">
                  <InputGroupAddon className="pl-1.5 text-muted-foreground">
                    {BIO_DOMAIN}/
                  </InputGroupAddon>
                  <InputGroupInput
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value)
                      setHasAttemptedStepOneContinue(false)
                      setStepOneErrors((current) => ({
                        ...current,
                        username: undefined,
                      }))
                    }}
                    autoComplete="off"
                    onBlur={() => setUsernameBlurred(true)}
                    placeholder="the_real_john"
                  />
                </InputGroup>
                <FieldDescription
                  className={
                    stepOneErrors.username || usernameStatus === "taken"
                      ? "text-destructive"
                      : usernameStatus === "available"
                        ? "text-emerald-700"
                        : undefined
                  }
                >
                  {usernameStatusText}
                </FieldDescription>
              </Field>

              <Field data-invalid={Boolean(stepOneErrors.title)}>
                <FieldLabel>Title</FieldLabel>
                <InputGroup className="[&>input]:rounded-4xl">
                  <InputGroupInput
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value)
                      setStepOneErrors((current) => ({
                        ...current,
                        title: undefined,
                      }))
                    }}
                    placeholder="John Labrador"
                  />
                </InputGroup>
                <FieldDescription
                  className={stepOneErrors.title ? "text-destructive" : ""}
                >
                  {stepOneErrors.title ||
                    "This appears as the title on your public page."}
                </FieldDescription>
              </Field>

              <Field data-invalid={Boolean(stepOneErrors.bio)}>
                <FieldLabel>Bio</FieldLabel>
                <Textarea
                  value={bio}
                  onChange={(event) => {
                    setBio(event.target.value)
                    setStepOneErrors((current) => ({
                      ...current,
                      bio: undefined,
                    }))
                  }}
                  placeholder="Making dreams come true"
                />
                <FieldDescription
                  className={stepOneErrors.bio ? "text-destructive" : ""}
                >
                  {stepOneErrors.bio ||
                    "A short summary visitors see on your page."}
                </FieldDescription>
              </Field>
            </FieldGroup>

            <div className="mt-2 border-t border-border/60 pt-4 sm:pt-5 flex justify-end">
              <Button
                onClick={() => void advanceFromStepOne()}
                disabled={uploading}
              >
                Next <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Instagram</FieldLabel>
                <InputGroup className="[--radius:9999px]">
                  <InputGroupAddon className="pl-1.5 text-muted-foreground">
                    {socialConfig.instagram.prefix}
                  </InputGroupAddon>
                  <InputGroupInput
                    value={socialHandles.instagram}
                    onChange={(event) =>
                      setSocialHandles((current) => ({
                        ...current,
                        instagram: normalizeSocialHandle(
                          "instagram",
                          event.target.value,
                        ),
                      }))
                    }
                    placeholder="username"
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>TikTok</FieldLabel>
                <InputGroup className="[--radius:9999px]">
                  <InputGroupAddon className="pl-1.5 text-muted-foreground">
                    {socialConfig.tiktok.prefix}
                  </InputGroupAddon>
                  <InputGroupInput
                    value={socialHandles.tiktok}
                    onChange={(event) =>
                      setSocialHandles((current) => ({
                        ...current,
                        tiktok: normalizeSocialHandle(
                          "tiktok",
                          event.target.value,
                        ),
                      }))
                    }
                    placeholder="username"
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Facebook</FieldLabel>
                <InputGroup className="[--radius:9999px]">
                  <InputGroupAddon className="pl-1.5 text-muted-foreground">
                    {socialConfig.facebook.prefix}
                  </InputGroupAddon>
                  <InputGroupInput
                    value={socialHandles.facebook}
                    onChange={(event) =>
                      setSocialHandles((current) => ({
                        ...current,
                        facebook: normalizeSocialHandle(
                          "facebook",
                          event.target.value,
                        ),
                      }))
                    }
                    placeholder="username"
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>LinkedIn</FieldLabel>
                <InputGroup className="[--radius:9999px]">
                  <InputGroupAddon className="pl-1.5 text-muted-foreground">
                    {socialConfig.linkedin.prefix}
                  </InputGroupAddon>
                  <InputGroupInput
                    value={socialHandles.linkedin}
                    onChange={(event) =>
                      setSocialHandles((current) => ({
                        ...current,
                        linkedin: normalizeSocialHandle(
                          "linkedin",
                          event.target.value,
                        ),
                      }))
                    }
                    placeholder="username"
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>YouTube</FieldLabel>
                <InputGroup className="[--radius:9999px]">
                  <InputGroupAddon className="pl-1.5 text-muted-foreground">
                    {socialConfig.youtube.prefix}
                  </InputGroupAddon>
                  <InputGroupInput
                    value={socialHandles.youtube}
                    onChange={(event) =>
                      setSocialHandles((current) => ({
                        ...current,
                        youtube: normalizeSocialHandle(
                          "youtube",
                          event.target.value,
                        ),
                      }))
                    }
                    placeholder="username"
                  />
                </InputGroup>
              </Field>
            </FieldGroup>

            <div className="mt-2 border-t border-border/60 pt-4 sm:pt-5 flex items-center justify-between">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSocialHandles(emptySocialHandles)
                    setCurrentStep(3)
                  }}
                >
                  Skip for now
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Next <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex w-full gap-x-6">
              <div className="grid grid-cols-2 mx-auto justify-center gap-3">
                {basicThemes.map((theme) => (
                  <ThemePreview
                    key={theme.name}
                    theme={theme}
                    selected={selectedTheme.name === theme.name}
                    onClick={() => setSelectedThemeName(theme.name)}
                    size="compact"
                    buttonCount={2}
                    className="w-32 md:w-44"
                  />
                ))}
              </div>

              <div className="hidden sm:block">
                <div className="w-72 overflow-hidden rounded-xl border">
                  <UserPage
                    profile={{
                      title: title.trim() || "Your Name",
                      bio: bio.trim() || "Your short bio appears here.",
                      avatarUrl: avatarPreviewUrl,
                      backgroundImageUrl: null,
                      backgroundColor: selectedTheme.backgroundColor,
                      fontFamily: selectedTheme.fontFamily,
                      textColor: selectedTheme.textColor,
                      buttonShape: selectedTheme.buttonShape,
                      buttonStyle: selectedTheme.buttonStyle,
                      buttonColor: selectedTheme.buttonColor,
                      buttonTextColor: selectedTheme.buttonTextColor,
                    }}
                    links={previewLinks}
                    className="min-h-96"
                    onFormLinkClick={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 border-t border-border/60 pt-4 sm:pt-5 flex items-center justify-between">
              <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => void submitOnboarding()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create profile"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
