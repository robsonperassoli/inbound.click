import { api } from "@convex/_generated/api"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/_authenticated/invites/$token")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { token } = Route.useParams()
  const navigate = useNavigate()
  const invitation = useQuery(api.accounts.queries.getInvitationByToken, {
    token,
  })
  const acceptInvitation = useMutation(api.accounts.mutations.acceptInvitation)

  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccept = async () => {
    setIsAccepting(true)
    setError(null)

    try {
      await acceptInvitation({ token })

      navigate({ to: "/bio", reloadDocument: true })
    } catch (acceptError) {
      setError(
        acceptError instanceof Error
          ? acceptError.message
          : "Failed to accept invitation",
      )
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-20 bg-card flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Team invitation</CardTitle>
          <CardDescription>
            Review your invitation and accept it to join the account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {invitation === undefined ? (
            <p className="text-sm text-muted-foreground">
              Loading invitation...
            </p>
          ) : invitation.status === "invalid" ? (
            <p className="text-sm text-destructive">{invitation.message}</p>
          ) : (
            <>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Invited email:</span>{" "}
                  {invitation.email}
                </p>
                <p>
                  <span className="font-medium">Role:</span> {invitation.role}
                </p>
                <p>
                  <span className="font-medium">Invited by:</span>{" "}
                  {invitation.invitedByName}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Accepting this invitation will remove your previous account
                memberships and move you to this team.
              </p>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                onClick={() => void handleAccept()}
                disabled={isAccepting}
              >
                {isAccepting ? "Accepting..." : "Accept invite"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
