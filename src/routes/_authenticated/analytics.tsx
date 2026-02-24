import { createFileRoute } from "@tanstack/react-router"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import { useSiteHeader } from "@/components/site-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const Route = createFileRoute("/_authenticated/analytics")({
  component: RouteComponent,
  ssr: false,
})

const clicksPerButtonData = [
  { button: "Portfolio", clicks: 1232, ctr: 46 },
  { button: "Newsletter", clicks: 892, ctr: 33 },
  { button: "Book a Call", clicks: 611, ctr: 24 },
  { button: "Shop", clicks: 478, ctr: 18 },
  { button: "YouTube", clicks: 355, ctr: 14 },
]

const weeklyVisitsData = [
  { week: "W1", visits: 920, unique: 712 },
  { week: "W2", visits: 1085, unique: 801 },
  { week: "W3", visits: 980, unique: 744 },
  { week: "W4", visits: 1264, unique: 932 },
  { week: "W5", visits: 1348, unique: 1008 },
  { week: "W6", visits: 1426, unique: 1089 },
]

const visitsPerDayData = [
  { day: "Mon", visits: 188 },
  { day: "Tue", visits: 214 },
  { day: "Wed", visits: 238 },
  { day: "Thu", visits: 251 },
  { day: "Fri", visits: 286 },
  { day: "Sat", visits: 329 },
  { day: "Sun", visits: 276 },
]

const clicksPerButtonConfig = {
  clicks: { label: "Clicks", color: "var(--chart-1)" },
} satisfies ChartConfig

const weeklyVisitsConfig = {
  visits: { label: "Visits", color: "var(--chart-2)" },
  unique: { label: "Unique Visitors", color: "var(--chart-4)" },
} satisfies ChartConfig

const visitsPerDayConfig = {
  visits: { label: "Daily Visits", color: "var(--chart-3)" },
} satisfies ChartConfig

function RouteComponent() {
  useSiteHeader({ title: "Analytics" })

  const totalVisits = weeklyVisitsData.reduce(
    (sum, week) => sum + week.visits,
    0,
  )
  const totalUnique = weeklyVisitsData.reduce(
    (sum, week) => sum + week.unique,
    0,
  )
  const totalClicks = clicksPerButtonData.reduce(
    (sum, button) => sum + button.clicks,
    0,
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader className="pb-0">
            <CardDescription>Total Visits (6 weeks)</CardDescription>
            <CardTitle>{totalVisits.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-0">
            <CardDescription>Unique Visitors</CardDescription>
            <CardTitle>{totalUnique.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-0">
            <CardDescription>Total Button Clicks</CardDescription>
            <CardTitle>{totalClicks.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clicks Per Button</CardTitle>
            <CardDescription>
              Top links and their click-through performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={clicksPerButtonConfig}>
              <BarChart data={clicksPerButtonData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="button" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <ChartTooltip
                  content={(props) => <ChartTooltipContent {...props} />}
                />
                <Bar dataKey="clicks" fill="var(--color-clicks)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visits Weekly</CardTitle>
            <CardDescription>
              Total visits vs unique visitors by week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyVisitsConfig}>
              <LineChart data={weeklyVisitsData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <ChartTooltip
                  content={(props) => <ChartTooltipContent {...props} />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="visits"
                  type="monotone"
                  stroke="var(--color-visits)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="unique"
                  type="monotone"
                  stroke="var(--color-unique)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visits Per Day</CardTitle>
            <CardDescription>
              Daily traffic trend from the current week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={visitsPerDayConfig}>
              <AreaChart data={visitsPerDayData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <ChartTooltip
                  content={(props) => <ChartTooltipContent {...props} />}
                />
                <Area
                  dataKey="visits"
                  type="monotone"
                  fill="var(--color-visits)"
                  fillOpacity={0.2}
                  stroke="var(--color-visits)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
