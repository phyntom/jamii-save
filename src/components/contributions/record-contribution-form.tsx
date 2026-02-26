'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { recordContributionSchema, Currency } from '@/validation/contribution';
import { recordContribution } from '@/server/contributions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react';
import { PopoverContent } from '@radix-ui/react-popover';
import { Calendar } from '../ui/calendar';

interface RecordContributionFormProps {
  groupId: string;
  contributionAmount: number;
  currency: Currency;
  onSuccess?: () => void;
}

export function RecordContributionForm({
  groupId,
  contributionAmount,
  currency,
  onSuccess,
}: RecordContributionFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(recordContributionSchema),
    defaultValues: {
      groupId: groupId,
      referenceNumber: '',
      amount: contributionAmount.toString(),
      contributionType: 'standard_contribution',
      contributionDate: new Date(),
      contributionPeriod: '',
      paymentMethod: 'cash',
      currency: currency,
      notes: ''
    },
    mode: 'onSubmit'
  })

  async function onSubmit(data: z.infer<typeof recordContributionSchema>) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await recordContribution({
      ...data,
      contributionDate: data.contributionDate as Date
    });

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={form.control}
        name="groupId"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <input type="hidden" id={field.name} {...field} />

            </FieldContent>
          </Field>
        )}
      />

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


      <div className="grid gap-4 md:grid-cols-2">

        {/* contribution amount */}
        <div className="space-y-2">
          <Controller
            control={form.control}
            name='amount'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='amount'>Amount *</FieldLabel>
                <FieldContent>

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
                </FieldContent>
                <FieldDescription>
                  Expected contribution: {contributionAmount.toFixed(2)}
                </FieldDescription>
              </Field>
            )}
          />
        </div>

        {/* contribution date */}
        <div className="space-y-2">
          <Controller
            control={form.control}
            name="contributionDate"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='contributionDate'>Contribution date *</FieldLabel>
                <FieldContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PP') : <span>Pick a date</span>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </FieldContent>
              </Field>
            )}
          />
        </div>
      </div>

      {/* contribution period & contribution type fields */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* contribution period field */}
        <div className="space-y-2">
          <Controller
            control={form.control}
            name='contributionPeriod'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='contributionPeriod'>Contribution period (Month) *</FieldLabel>
                <FieldContent>
                  <Input type="text" id={field.name} {...field} />
                </FieldContent>
              </Field>
            )}
          />
        </div>

        {/* contribution type field */}
        <div className="space-y-2">
          <Controller
            control={form.control}
            name='contributionType'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='contributionType'>Contribution type *</FieldLabel>
                <Select name='contributionType' onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select contribution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='standard_contribution'>Standard contribution</SelectItem>
                    <SelectItem value='loan_payment'>Loan payment</SelectItem>
                    <SelectItem value='social_activities'>Social activities</SelectItem>
                    <SelectItem value='emergency_fund'>Emergency fund</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Controller
            control={form.control}
            name='paymentMethod'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="paymentMethod">Payment Method *</FieldLabel>
                <Select name="paymentMethod" onValueChange={field.onChange} defaultValue={field.value} required disabled={loading}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_deposit">Bank deposit</SelectItem>
                    <SelectItem value="mobile_money">Mobile money</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_card">Credit card</SelectItem>
                    <SelectItem value="interac">Interac</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <div className="space-y-2">
          <Controller
            control={form.control}
            name='referenceNumber'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="referenceNumber">Reference Number</FieldLabel>
                <FieldContent>
                  <Input
                    id={field.name}
                    placeholder="Transaction reference (optional)"
                    disabled={loading}
                    {...field}
                  />

                </FieldContent>
              </Field>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Controller
          control={form.control}
          name='notes'
          render={({ field, fieldState, }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <FieldContent>
                <Textarea
                  id={field.name}
                  placeholder="Additional notes (optional)"
                  disabled={loading}
                  {...field}
                />
              </FieldContent>
            </Field>
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Recording...' : 'Record Contribution'}
      </Button>
    </form>
  );
}
