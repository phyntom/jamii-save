'use client';

import { useState } from 'react';
import { requestLoan } from '@/app/actions/loans';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RequestLoanFormProps {
  groupId: number;
  maxLoanAmount?: number;
  interestRate: number;
  onSuccess?: () => void;
}

export function RequestLoanForm({
  groupId,
  maxLoanAmount,
  interestRate,
  onSuccess,
}: RequestLoanFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await requestLoan(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.message || 'Loan request submitted successfully');
      setTimeout(() => {
        setSuccess(null);
        onSuccess?.();
      }, 2000);
    }

    setLoading(false);
  }

  // Calculate loan preview
  const principal = Number(amount) || 0;
  const monthsNum = Number(months) || 0;
  const interest = principal * (interestRate / 100) * (monthsNum / 12);
  const total = principal + interest;
  const monthly = monthsNum > 0 ? total / monthsNum : 0;

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
        <Label htmlFor="amount">Loan Amount ($) *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          max={maxLoanAmount}
          placeholder="1000.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={loading}
        />
        {maxLoanAmount && (
          <p className="text-xs text-muted-foreground">
            Maximum loan amount: ${maxLoanAmount.toFixed(2)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="repaymentMonths">Repayment Period (Months) *</Label>
        <Input
          id="repaymentMonths"
          name="repaymentMonths"
          type="number"
          min="1"
          placeholder="12"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Loan Purpose *</Label>
        <Textarea
          id="purpose"
          name="purpose"
          placeholder="Describe why you need this loan..."
          required
          disabled={loading}
          minLength={10}
        />
      </div>

      {principal > 0 && monthsNum > 0 && (
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h4 className="font-medium">Loan Preview</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Principal:</span>
              <span className="font-medium">${principal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest ({interestRate}%):</span>
              <span className="font-medium">${interest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Payment:</span>
              <span className="font-medium">${monthly.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Loan Request'}
      </Button>
    </form>
  );
}
