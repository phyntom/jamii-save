'use client';

import { useState } from 'react';
import { recordContribution } from '@/server/contributions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface RecordContributionFormProps {
  groupId: number;
  contributionAmount: number;
  onSuccess?: () => void;
}

export function RecordContributionForm({
  groupId,
  contributionAmount,
  onSuccess,
}: RecordContributionFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await recordContribution(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.message || 'Contribution recorded successfully');
      setTimeout(() => {
        setSuccess(null);
        onSuccess?.();
      }, 2000);
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="groupId" value={groupId} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($) *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          defaultValue={contributionAmount}
          placeholder="100.00"
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          Expected contribution: ${contributionAmount.toFixed(2)}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method *</Label>
        <Select name="paymentMethod" required disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="referenceNumber">Reference Number</Label>
        <Input
          id="referenceNumber"
          name="referenceNumber"
          placeholder="Transaction reference (optional)"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional notes (optional)"
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Recording...' : 'Record Contribution'}
      </Button>
    </form>
  );
}
