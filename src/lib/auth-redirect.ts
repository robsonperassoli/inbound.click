const DEFAULT_AUTH_REDIRECT = "/bio"

export function getSafeAuthRedirect(redirect: string | null | undefined) {
  if (!redirect) {
    return DEFAULT_AUTH_REDIRECT
  }

  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT
  }

  return redirect
}
