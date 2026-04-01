import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import {
  MoreHorizontal,
  Refresh01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import z from "zod"
import { ScrollableContainer } from "@/components/app-layout/scrollable-container"
import { useSiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getInitials } from "@/lib/names"

export const Route = createFileRoute("/_authenticated/team")({
  component: RouteComponent,
})

type Member = {
  userId: Id<"users">
  email: string
  name: string
  role: "owner" | "admin" | "member"
  profiles: string[]
  joinedAt: number
}

type Invitation = {
  invitationId: Id<"invitations">
  email: string
  role: "owner" | "admin" | "member"
  profiles: string[]
  expiresAt: number
  invitedByName: string
}

type TeamMember = {
  id: string
  type: "member"
  email: string
  name: string
  role: "owner" | "admin" | "member"
  date: number
  member: Member
}

type TeamInvitation = {
  id: string
  type: "invitation"
  email: string
  name: string
  role: "owner" | "admin" | "member"
  date: number
  invitation: Invitation
}

type TeamRow = TeamMember | TeamInvitation

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "member"]),
})

function RouteComponent() {
  useSiteHeader({ title: "Team", titleMode: "append" })

  const members = useQuery(api.accounts.queries.listMembers)
  const invitations = useQuery(api.accounts.queries.listInvitations)

  if (members === undefined || invitations === undefined) {
    return <div className="text-sm text-muted-foreground">Loading team...</div>
  }

  const rows: TeamRow[] = [
    ...members.map(
      (m): TeamMember => ({
        id: m.userId,
        type: "member",
        email: m.email,
        name: m.name,
        role: m.role,
        date: m.joinedAt,
        member: m,
      }),
    ),
    ...invitations.map(
      (i): TeamInvitation => ({
        id: i.invitationId,
        type: "invitation",
        email: i.email,
        name: i.email,
        role: i.role,
        date: i.expiresAt,
        invitation: i,
      }),
    ),
  ].sort((a, b) => {
    if (a.type === "member" && b.type === "invitation") return -1
    if (a.type === "invitation" && b.type === "member") return 1
    if (a.type === "member") {
      return a.date - b.date
    }
    return b.date - a.date
  })

  return (
    <ScrollableContainer className="max-w-3xl">
      <TeamCard rows={rows} />
    </ScrollableContainer>
  )
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatExpiresAt(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return "Expired"
  }
  if (diffDays === 0) {
    return "Expires today"
  }
  if (diffDays === 1) {
    return "Expires tomorrow"
  }
  return `Expires in ${diffDays} days`
}

function RoleBadge({ role }: { role: "owner" | "admin" | "member" }) {
  const variant =
    role === "owner" ? "default" : role === "admin" ? "secondary" : "outline"

  return (
    <Badge variant={variant} className="capitalize">
      {role}
    </Badge>
  )
}

function StatusBadge({ row }: { row: TeamRow }) {
  if (row.type === "member") {
    return <Badge variant="outline">Member</Badge>
  }
  return <Badge variant="secondary">Pending</Badge>
}

function TeamCard({ rows }: { rows: TeamRow[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardAction>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <HugeiconsIcon
                  icon={UserAdd01Icon}
                  size={16}
                  className="mr-2"
                />
                Invite member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <InviteDialogContent onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-16">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No team members yet
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-6">
                    {row.type === "member" ? (
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {getInitials(row.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{row.name}</p>
                          <p className="text-muted-foreground text-xs truncate">
                            {row.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="font-medium">{row.email}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={row.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge row={row} />
                  </TableCell>
                  <TableCell className="pr-16">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        {row.type === "member"
                          ? formatDate(row.date)
                          : formatExpiresAt(row.date)}
                      </span>
                      {row.type === "invitation" && (
                        <InvitationActions invitation={row.invitation} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function InvitationActions({ invitation }: { invitation: Invitation }) {
  const resendInvitation = useMutation(api.accounts.mutations.resendInvitation)
  const revokeInvitation = useMutation(api.accounts.mutations.revokeInvitation)

  const [isResending, setIsResending] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)

  const handleResend = async () => {
    setIsResending(true)
    try {
      await resendInvitation({ invitationId: invitation.invitationId })
    } finally {
      setIsResending(false)
    }
  }

  const handleRevoke = async () => {
    setIsRevoking(true)
    try {
      await revokeInvitation({ invitationId: invitation.invitationId })
    } finally {
      setIsRevoking(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="pl-2!"
          disabled={isResending || isRevoking}
        >
          <HugeiconsIcon icon={MoreHorizontal} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleResend} disabled={isResending}>
          <HugeiconsIcon icon={Refresh01Icon} size={16} className="mr-2" />
          {isResending ? "Resending..." : "Resend invite"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleRevoke}
          disabled={isRevoking}
          variant="destructive"
        >
          <HugeiconsIcon icon={MoreHorizontal} size={16} className="mr-2" />
          {isRevoking ? "Revoking..." : "Revoke invite"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function InviteDialogContent({ onSuccess }: { onSuccess: () => void }) {
  const createInvitation = useMutation(api.accounts.mutations.createInvitation)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      role: "member" as "admin" | "member",
    },
    validators: {
      onSubmit: inviteSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        await createInvitation({
          email: value.email.trim().toLowerCase(),
          role: value.role,
          profiles: ["all"],
        })
        onSuccess()
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Failed to send invitation",
        )
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>Invite team member</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup className="py-6">
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Email address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="colleague@example.com"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "admin" | "member")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          {submitError && (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}
        </FieldGroup>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onSuccess}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Sending..." : "Send invite"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
