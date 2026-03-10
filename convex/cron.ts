import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval(
  "handle abandoned form submission threads",
  { minutes: 1 },
  internal.threads.mutations.autoCloseAbandonedThreads,
)

export default crons
