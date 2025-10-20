'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createGroup } from '@/app/actions/groups';
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

export function CreateCommunityForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // async function handleSubmit(formData: FormData) {
  // 	setLoading(true);
  // 	setError(null);

  // 	// const result = await createGroup(formData);

  // 	if (result?.error) {
  // 		setError(result.error);
  // 		setLoading(false);
  // 	} else if (result?.success) {
  // 		router.push(`/dashboard/groups/${result.groupId}`);
  // 	}
  // }

  return (
    <form className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Group Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Family Savings Group"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="A brief description of your savings group"
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contributionFrequency">Contribution Frequency *</Label>
          <Select name="contributionFrequency" required disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contributionAmount">Contribution Amount ($) *</Label>
          <Input
            id="contributionAmount"
            name="contributionAmount"
            type="number"
            step="0.01"
            min="0"
            placeholder="100.00"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contributionDay">Contribution Day *</Label>
        <Input
          id="contributionDay"
          name="contributionDay"
          type="number"
          min="1"
          max="31"
          placeholder="1-31 for monthly, 1-7 for weekly"
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          For monthly: 1-31 (day of month). For weekly: 1-7 (1=Monday, 7=Sunday)
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Loan Settings (Optional)</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="loanInterestRate">Interest Rate (%)</Label>
            <Input
              id="loanInterestRate"
              name="loanInterestRate"
              type="number"
              step="0.01"
              min="0"
              placeholder="5.00"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLoanAmount">Max Loan Amount ($)</Label>
            <Input
              id="maxLoanAmount"
              name="maxLoanAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="1000.00"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateFeeAmount">Late Fee Amount ($)</Label>
            <Input
              id="lateFeeAmount"
              name="lateFeeAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="10.00"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gracePeriodDays">Grace Period (Days)</Label>
            <Input
              id="gracePeriodDays"
              name="gracePeriodDays"
              type="number"
              min="0"
              placeholder="7"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
