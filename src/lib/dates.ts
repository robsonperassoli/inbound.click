import type { Temporal } from "@js-temporal/polyfill"

export const formatToTinybirdDateTime = (instant: Temporal.Instant) => {
  const dt = instant.toZonedDateTimeISO("UTC")

  return `${dt.year}-${String(dt.month).padStart(2, "0")}-${String(
    dt.day,
  ).padStart(2, "0")} ${String(dt.hour).padStart(2, "0")}:${String(
    dt.minute,
  ).padStart(2, "0")}:${String(dt.second).padStart(2, "0")}`
}
