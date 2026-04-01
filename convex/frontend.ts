import type { Id } from "./_generated/dataModel"

export const SITE_URL = process.env.SITE_URL!

export const formSubmissionTranscriptUrl = (
  formId: Id<"forms">,
  submissionId: Id<"formSubmissions">,
) => {
  return `${SITE_URL}/forms/${formId}/submissions/${submissionId}/transcript`
}

export const invitationUrl = (token: string) => {
  return `${SITE_URL}/invites/${token}`
}
