"use client"

import {
  Chart03Icon,
  DatabaseLightningIcon,
  LifeBuoy,
  ListViewIcon,
  Send,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import type * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo from "../assets/logo.svg"

const data = {
  navMain: [
    {
      title: "Bio",
      url: "/bio",
      icon: <HugeiconsIcon icon={ListViewIcon} strokeWidth={2} />,
      isActive: true,
      items: [
        {
          title: "Links",
          url: "/bio",
        },
        {
          title: "Appearance",
          url: "/bio/appearance",
        },
        {
          title: "Settings",
          url: "/bio/settings",
        },
      ],
    },
    {
      title: "Forms",
      url: "/forms",
      icon: <HugeiconsIcon icon={DatabaseLightningIcon} strokeWidth={2} />,
      items: [],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: <HugeiconsIcon icon={Chart03Icon} strokeWidth={2} />,
      items: [],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <HugeiconsIcon icon={LifeBuoy} strokeWidth={2} />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <HugeiconsIcon icon={Send} strokeWidth={2} />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                to="/bio"
                className="shrink-0 text-sm font-semibold tracking-tight whitespace-nowrap"
              >
                <img src={logo} alt="Inbound.click logo" className="w-full" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
