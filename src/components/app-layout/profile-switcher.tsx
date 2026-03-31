import { api } from "@convex/_generated/api"
import { Plus, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "convex/react"
import { useEffect, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { getInitials } from "@/lib/names"
import { setSelectedProfile, useSelectedProfileId } from "@/stores/profiles"
import { Avatar, AvatarFallback } from "../ui/avatar"

export function ProfileSwitcher() {
  const { isMobile } = useSidebar()
  const profiles = useQuery(api.profiles.queries.getAvailableProfiles)
  const profileId = useSelectedProfileId()

  const profile = useMemo(
    () => profiles?.find((p) => p._id === profileId) ?? null,
    [profiles, profileId],
  )

  useEffect(() => {
    if (!profileId && profiles && profiles.length > 0) {
      setSelectedProfile(profiles[0]._id)
    }
  }, [profiles, profileId])

  if (!profile) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar size="default">
                {/*<AvatarImage src={profile.avatarUrl} />*/}
                <AvatarFallback>{getInitials(profile.title)}</AvatarFallback>
              </Avatar>
              {/*<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              </div>*/}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{profile.title}</span>
                <span className="truncate text-xs">{profile.username}</span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Pages
            </DropdownMenuLabel>
            {profiles?.map((profile, index) => (
              <DropdownMenuItem
                key={profile.username}
                onClick={() => setSelectedProfile(profile._id)}
                className="gap-2 p-2"
              >
                <Avatar size="sm">
                  {/*<AvatarImage src={profile.avatarUrl} />*/}
                  <AvatarFallback>{getInitials(profile.title)}</AvatarFallback>
                </Avatar>
                {profile.title}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <HugeiconsIcon icon={Plus} className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add page</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
