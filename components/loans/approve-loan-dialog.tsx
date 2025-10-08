"use client"

import { useState } from "react"
import { approveLoan } from "@/app/actions/loans"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, X } from "lucide-react"

interface ApproveLoanDialogProps {
  loanId: number
  action: "approve" | "reject"
}

export function ApproveLoanDialog({ loanId, action }: ApproveLoanDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await approveLoan(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={action === "approve" ? "default" : "destructive"}>
          {action === "approve" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action === "approve" ? "Approve" : "Reject"} Loan</DialogTitle>
          <DialogDescription>
            {action === "approve"
              ? "Confirm that this loan request should be approved"
              : "Reject this loan request with an optional reason"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="loanId" value={loanId} />
          <input type="hidden" name="action" value={action} />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder={action === "approve" ? "Additional notes..." : "Reason for rejection..."}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant={action === "approve" ? "default" : "destructive"} disabled={loading}>
              {loading ? "Processing..." : action === "approve" ? "Approve" : "Reject"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
