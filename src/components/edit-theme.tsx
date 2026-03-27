import { api } from "@convex/_generated/api"
import type { Doc } from "@convex/_generated/dataModel"
import { Delete01Icon, Image03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery } from "convex/react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { fonts } from "@/lib/themes"
import { FileUpload } from "./file-upload"
import { ImagePreview } from "./image-preview"
import { Button } from "./ui/button"
import { ColorPickerField } from "./ui/color-picker-field"
import { Field, FieldGroup, FieldTitle } from "./ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Separator } from "./ui/separator"
import { Spinner } from "./ui/spinner"

type Profile = Doc<"profiles">

const buttonShapes: Array<{ value: Profile["buttonShape"]; label: string }> = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "pill", label: "Pill" },
]

const buttonStyles: Array<{ value: Profile["buttonStyle"]; label: string }> = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "paper", label: "Paper" },
  { value: "shadow", label: "Shadow" },
  { value: "3d", label: "3D" },
  { value: "ghost", label: "Ghost" },
]

const fontCategories: Record<string, string> = {
  sans: "Sans-Serif",
  serif: "Serif",
  display: "Display",
}

export function EditTheme({
  profileId,
}: {
  profileId: Doc<"profiles">["_id"]
}) {
  const { uploadFile, uploading } = useFileUpload()
  const profile = useQuery(api.profiles.queries.getProfile, { profileId })
  const updateTheme = useMutation(api.profiles.mutations.updateTheme)

  if (!profile) {
    return <div>Loading...</div>
  }

  const handleUpdate = async (updates: Partial<Omit<Profile, "theme">>) => {
    await updateTheme({
      profileId: profile._id,
      theme: "Custom",
      backgroundImage: profile.backgroundImage,
      backgroundColor: profile.backgroundColor,
      fontFamily: profile.fontFamily,
      textColor: profile.textColor,
      buttonShape: profile.buttonShape,
      buttonStyle: profile.buttonStyle,
      buttonColor: profile.buttonColor,
      buttonTextColor: profile.buttonTextColor,
      ...updates,
    })
  }

  const handleBackgroundUpload = async (file: File) => {
    const { storageId } = await uploadFile(file)

    await handleUpdate({ backgroundImage: storageId })
  }

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldTitle>Background Image</FieldTitle>
        <div className="flex space-x-2">
          {profile.backgroundImageUrl && (
            <ImagePreview url={profile.backgroundImageUrl} />
          )}
          <FileUpload onChange={(_url, file) => handleBackgroundUpload(file)}>
            <Button variant="secondary" disabled={uploading}>
              {uploading ? (
                <>
                  <Spinner /> Uploading...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Image03Icon} /> Select image
                </>
              )}
            </Button>
          </FileUpload>
          {profile.backgroundImage && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate({ backgroundImage: undefined })}
              title="Remove background image"
            >
              <HugeiconsIcon icon={Delete01Icon} />
            </Button>
          )}
        </div>
      </Field>

      <Separator />

      {/* Colors */}
      <Field orientation="horizontal">
        <FieldTitle>Background Color</FieldTitle>
        <ColorPickerField
          value={profile.backgroundColor}
          onChange={(backgroundColor) => handleUpdate({ backgroundColor })}
        />
      </Field>

      <Separator />

      <Field orientation="horizontal">
        <FieldTitle>Text Color</FieldTitle>
        <ColorPickerField
          value={profile.textColor}
          onChange={(textColor) => handleUpdate({ textColor })}
        />
      </Field>

      <Separator />

      <Field orientation="horizontal">
        <FieldTitle>Button Color</FieldTitle>
        <ColorPickerField
          value={profile.buttonColor}
          onChange={(buttonColor) => handleUpdate({ buttonColor })}
        />
      </Field>

      <Separator />

      <Field orientation="horizontal">
        <FieldTitle>Button Text Color</FieldTitle>
        <ColorPickerField
          value={profile.buttonTextColor}
          onChange={(buttonTextColor) => handleUpdate({ buttonTextColor })}
        />
      </Field>

      <Separator />

      {/* Button Shape */}
      <Field orientation="horizontal">
        <FieldTitle>Button Shape</FieldTitle>
        <div className="flex gap-2">
          {buttonShapes.map((shape) => (
            <Button
              key={shape.value}
              variant={
                profile.buttonShape === shape.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleUpdate({ buttonShape: shape.value })}
            >
              {shape.label}
            </Button>
          ))}
        </div>
      </Field>

      <Separator />

      {/* Button Style */}
      <Field orientation="horizontal">
        <FieldTitle>Button Style</FieldTitle>
        <div className="flex flex-wrap gap-2 max-w-72 justify-end">
          {buttonStyles.map((style) => (
            <Button
              key={style.value}
              variant={
                profile.buttonStyle === style.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleUpdate({ buttonStyle: style.value })}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </Field>

      <Separator />

      {/* Font Family */}
      <Field orientation="horizontal">
        <FieldTitle>Font Family</FieldTitle>
        <Select
          value={profile.fontFamily}
          onValueChange={(value) => handleUpdate({ fontFamily: value })}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(fontCategories).map(([category, label]) => (
              <SelectGroup key={category}>
                <SelectLabel>{label}</SelectLabel>
                {fonts
                  .filter((font) => font.category === category)
                  .map((font) => (
                    <SelectItem key={font.name} value={font.name}>
                      <span style={{ fontFamily: font.fontFamily }}>
                        {font.name}
                      </span>
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  )
}
