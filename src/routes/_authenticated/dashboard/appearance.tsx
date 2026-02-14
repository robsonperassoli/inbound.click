import { api } from "@convex/_generated/api"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { EditTheme } from "@/components/edit-theme"
import { Button } from "@/components/ui/button"
import { type Theme, themes } from "@/lib/themes"

export const Route = createFileRoute("/_authenticated/dashboard/appearance")({
  component: RouteComponent,
})

function RouteComponent() {
  const { profileId } = useLoaderData({ from: "/_authenticated/dashboard" })
  const updateTheme = useMutation(api.profiles.updateTheme)

  const changeTheme = async (theme: Theme) => {
    await updateTheme({
      profileId,
      theme: theme.name,
      backgroundColor: theme.backgroundColor,
      backgroundImage: undefined,
      fontFamily: theme.fontFamily,
      textColor: theme.textColor,
      buttonShape: theme.buttonShape,
      buttonStyle: theme.buttonStyle,
      buttonColor: theme.buttonColor,
      buttonTextColor: theme.buttonTextColor,
    })
  }

  return (
    <div className="grid grid-cols-2">
      {/*{themes.map((theme) => (
        <Button
          key={theme.name}
          variant="ghost"
          size="sm"
          className="w-full h-14"
          onClick={() => changeTheme(theme)}
        >
          {theme.name}
        </Button>
      ))}*/}

      <EditTheme profileId={profileId} />
    </div>
  )
}
