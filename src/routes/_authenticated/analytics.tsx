import { api } from "@convex/_generated/api"
import { getProfileLinks } from "@convex/links/queries"
import { Temporal } from "@js-temporal/polyfill"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import z from "zod"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatToTinybirdDateTime } from "@/lib/dates"
import { getOverview } from "@/lib/server/analytics.functions"

const periodSchema = z.enum(["today", "7days", "30days", "3months", "6months"])
type TimePeriod = z.infer<typeof periodSchema>

const periodSelectOptions: { label: string; value: TimePeriod }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Last 6 Months", value: "6months" },
]

const getPeriodDates = (period: TimePeriod) => {
  const end = Temporal.Now.zonedDateTimeISO().with({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
  })

  const start = Temporal.Now.zonedDateTimeISO().with({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })

  switch (period) {
    case "today": {
      return {
        start,
        end,
      }
    }
    case "7days":
      return {
        start: start.subtract({ days: 7 }),
        end: end,
      }
    case "30days": {
      return {
        start: start.subtract({ days: 30 }),
        end: end,
      }
    }
    case "3months": {
      return {
        start: start.subtract({ days: 90 }),
        end: end,
      }
    }
    case "6months":
      return {
        start: start.subtract({ days: 180 }),
        end: end,
      }
  }
}

export const Route = createFileRoute("/_authenticated/analytics")({
  component: RouteComponent,
  ssr: false,
  validateSearch: {
    parse: z.object({
      period: periodSchema.default("7days"),
    }).parse,
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const profile = await context.convex.query(
      api.profiles.queries.getProfile,
      {},
    )

    const links = await context.convex.query(
      api.links.queries.getProfileLinks,
      { profileId: profile._id },
    )

    const dateRange = getPeriodDates(deps.period)

    const stats = await getOverview({
      data: {
        profileId: profile._id,
        start: formatToTinybirdDateTime(dateRange.start.toInstant()),
        end: formatToTinybirdDateTime(dateRange.end.toInstant()),
      },
    })

    return {
      stats,
      links,
    }
  },
})

const clicksPerLinkConfig = {
  clicks: { label: "Clicks", color: "var(--chart-1)" },
  ctr: { label: "CTR %", color: "var(--chart-2)" },
} satisfies ChartConfig

const deviceConfig = {
  device: { label: "Device", color: "var(--chart-1)" },
} satisfies ChartConfig

const referrerConfig = {
  referrer: { label: "Referrer", color: "var(--chart-1)" },
} satisfies ChartConfig

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function RouteComponent() {
  useSiteHeader({ title: "Analytics" })
  const navigate = useNavigate()
  const {
    stats: { linkClicks, overview, deviceBreakdown, referrerBreakdown },
    links,
  } = Route.useLoaderData()
  const { period } = Route.useSearch()

  const linkLabelById: Record<string, string> = useMemo(
    () => links.reduce((acc, l) => ({ ...acc, [l._id]: l.title }), {}),
    [links],
  )

  const averageCTR = useMemo(() => {
    if (overview?.average_ctr !== undefined) {
      return overview.average_ctr * 100
    }
    if (!overview || overview.total_page_views === 0) return 0
    return (overview.total_link_clicks / overview.total_page_views) * 100
  }, [overview])

  const clicksPerLinkData = useMemo(
    () =>
      linkClicks?.map((l) => {
        const ctr = overview?.total_page_views
          ? (l.clicks / overview.total_page_views) * 100
          : 0
        return {
          link: linkLabelById[l.link_id] ?? "Unknown",
          clicks: l.clicks,
          ctr: Number(ctr.toFixed(2)),
        }
      }) ?? [],
    [linkClicks, overview, linkLabelById],
  )

  const deviceData = useMemo(
    () =>
      deviceBreakdown?.map((d) => ({
        device: d.device,
        views: d.views,
      })) ?? [],
    [deviceBreakdown],
  )

  const referrerData = useMemo(
    () =>
      referrerBreakdown?.map((r) => ({
        referrer: r.referrer || "Direct",
        views: r.views,
      })) ?? [],
    [referrerBreakdown],
  )

  return (
    <div className="space-y-6">
      <Select
        value={period}
        onValueChange={(selectedPeriod: TimePeriod) =>
          navigate({ to: ".", search: { period: selectedPeriod } })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a time period" />
        </SelectTrigger>
        <SelectContent>
          {periodSelectOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader className="pb-0">
            <CardDescription>Total Page Views</CardDescription>
            <CardTitle>{overview?.total_page_views ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-0">
            <CardDescription>Unique Visitors</CardDescription>
            <CardTitle>{overview?.unique_visitors ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-0">
            <CardDescription>Total Link Clicks</CardDescription>
            <CardTitle>{overview?.total_link_clicks ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader className="pb-0">
            <CardDescription>Average CTR</CardDescription>
            <CardTitle>{averageCTR.toFixed(2)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* Clicks Per Link */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks Per Link</CardTitle>
            <CardDescription>
              Top links with clicks and CTR (CTR = Link Clicks / Total Page
              Views)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={clicksPerLinkConfig}>
              <BarChart data={clicksPerLinkData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="link" tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="clicks"
                  fill="var(--color-clicks)"
                  radius={4}
                />
                <Bar
                  yAxisId="right"
                  dataKey="ctr"
                  fill="var(--color-ctr)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Traffic Insights */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Views by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={deviceConfig}>
                <BarChart data={deviceData} layout="vertical">
                  <CartesianGrid horizontal={true} vertical={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="device"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="var(--color-device)" radius={4}>
                    {deviceData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Referrer Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Referrer Breakdown</CardTitle>
              <CardDescription>Top traffic sources</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={referrerConfig}>
                <BarChart data={referrerData} layout="vertical">
                  <CartesianGrid horizontal={true} vertical={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="referrer"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="var(--color-referrer)" radius={4}>
                    {referrerData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
