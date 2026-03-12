import { api } from "@convex/_generated/api"
import { Sparkles } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useNavigate } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "../ui/spinner"

export function DesignAiButton() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const createDesignThread = useMutation(
    api.threads.mutations.createThemeDesignerThread,
  )

  const startDesigning = async () => {
    try {
      setLoading(true)
      const { threadId } = await createDesignThread({})
      navigate({ to: "/design/theme/$threadId", params: { threadId } })
    } catch (error) {
      console.error(error)
      toast.error("Could not start a conversation with the AI")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="secondary" onClick={startDesigning} disabled={loading}>
      {loading ? (
        <Spinner />
      ) : (
        <HugeiconsIcon icon={Sparkles} className="text-primary" />
      )}{" "}
      Design with AI
    </Button>
  )
}
