import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { useMemo } from "react"

export function useFormSubmissions(formId: Id<"forms">) {
  const submissionsData = useQuery(api.forms.getUserFormSubmissions, {
    formId,
  })

  const labeledSubmissions = useMemo(
    () => submissionsData ?? [],
    [submissionsData],
  )

  return labeledSubmissions
}
