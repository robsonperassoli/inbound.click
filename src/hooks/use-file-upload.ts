import { api } from "@convex/_generated/api"
import { useMutation } from "convex/react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setUploading(true)
        const uploadUrl = await generateUploadUrl({})

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        })

        return result.json()
      } catch (err) {
        console.error(err)
        toast.error("Failed to upload image")
      } finally {
        setUploading(false)
      }
    },
    [generateUploadUrl],
  )

  return { uploading, uploadFile }
}
