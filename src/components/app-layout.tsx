import {
  Chart03Icon,
  DatabaseLightningIcon,
  ListViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import logo from "../assets/logo.svg"
import { ShareButton } from "./share-button"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { to: "/bio", label: "Bio", icon: ListViewIcon },
    { to: "/forms", label: "Forms", icon: DatabaseLightningIcon },
    { to: "/analytics", label: "Analytics", icon: Chart03Icon },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-5xl flex-nowrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/forms"
            className="shrink-0 text-sm font-semibold tracking-tight whitespace-nowrap"
          >
            <img src={logo} alt="Inbound.click logo" className="w-40" />
          </Link>

          <nav className="min-w-0">
            <div className="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-muted/40 p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: false }}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all"
                  activeProps={{
                    className:
                      "bg-background text-foreground shadow-sm ring-1 ring-border/70",
                  }}
                  inactiveProps={{
                    className:
                      "text-muted-foreground hover:bg-background hover:text-foreground",
                  }}
                >
                  <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="grow flex justify-end">
            <ShareButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  )
}
