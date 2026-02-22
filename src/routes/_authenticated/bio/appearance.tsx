import { api } from "@convex/_generated/api"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { EditTheme } from "@/components/edit-theme"
import { ThemePreview } from "@/components/theme-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Theme, themes } from "@/lib/themes"

export const Route = createFileRoute("/_authenticated/bio/appearance")({
  component: RouteComponent,
})

function RouteComponent() {
  const { profileId } = useLoaderData({ from: "/_authenticated/bio" })
  const profile = useQuery(api.profiles.queries.getProfile, { profileId })
  const updateTheme = useMutation(api.profiles.mutations.updateTheme)
  const [activeView, setActiveView] = useState<"customize" | "themes">(
    "customize",
  )

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

  const startCustomizing = async () => {
    if (!profile) {
      return
    }

    await updateTheme({
      profileId,
      theme: "Custom",
      backgroundColor: profile.backgroundColor,
      backgroundImage: profile.backgroundImage,
      fontFamily: profile.fontFamily,
      textColor: profile.textColor,
      buttonShape: profile.buttonShape,
      buttonStyle: profile.buttonStyle,
      buttonColor: profile.buttonColor,
      buttonTextColor: profile.buttonTextColor,
    })
  }

  if (!profile) {
    return null
  }

  const isCustomTheme = profile.theme === "Custom"

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border p-4">
        <div className="space-y-2">
          <div>
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">
              {isCustomTheme
                ? "Current style: Custom"
                : `Current style: ${profile.theme}`}
            </p>
          </div>
        </div>

        <Tabs
          value={activeView}
          onValueChange={(value) =>
            setActiveView(value as "customize" | "themes")
          }
        >
          <TabsList>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="pt-4">
            {isCustomTheme ? (
              <EditTheme profileId={profileId} />
            ) : (
              <div className="space-y-3">
                <h3 className="font-medium">Customize Current Theme</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start from your current theme and fine-tune colors, fonts, and
                  button styles.
                </p>
                <div className="pt-1">
                  <Button onClick={startCustomizing}>Start Customizing</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="themes" className="space-y-3 pt-4">
            <div>
              <h3 className="text-lg font-semibold">Choose a Theme</h3>
              <p className="text-sm text-muted-foreground">
                Pick a preset, then customize it any time.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {themes.map((theme) => (
                <ThemePreview
                  key={theme.name}
                  selected={!isCustomTheme && profile.theme === theme.name}
                  theme={theme}
                  onClick={() => changeTheme(theme)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
