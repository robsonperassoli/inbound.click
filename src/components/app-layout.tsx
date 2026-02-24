import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader, SiteHeaderProvider } from "./site-header"
import { Toaster } from "./ui/sonner"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteHeaderProvider>
      <SidebarProvider
        style={
          {
            // "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />

          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </SiteHeaderProvider>
  )
}
