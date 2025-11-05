'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CalendarIcon, Loader2, Plus, SproutIcon, UsersRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import { createCommunity, getPlans } from '@/server/community';
import { Plan } from '@/drizzle/schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { authClient, useSession } from '@/lib/auth-client';
import { FieldGroup, Field, FieldLabel, FieldContent, FieldDescription, FieldError } from '@/components/ui/field';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoadingSwap } from '../ui/loading-swap';

export const createCommunitySchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  visibility: z.enum(['public', 'private', 'unlisted'], {
    message: 'Please select a valid visibility option',
  }),
  contributionFrequency: z.enum(['monthly', 'annual', 'one-time']).default('monthly'),
  country: z.enum(['CANADA', 'UNITED_STATES', 'UNITED_KINGDOM', 'EUROZONE', 'KENYA', 'NIGERIA', 'SOUTH_AFRICA', 'GHANA', 'TANZANIA', 'UGANDA', 'RWANDA']).default('CANADA'),
  currency: z
    .enum(['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'GHS', 'TZS', 'UGX', 'RWF', 'CAD'])
    .default('CAD'),
  targetAmount: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((value) => !isNaN(value) && value > 0, {
      message: 'Target amount must be a positive number',
    })
    .refine(
      (value) => {
        const cents = value * 100;
        return Number.isInteger(cents);
      },
      {
        message: 'Up to 2 decimal places allowed',
      },
    ),
  planType: z.string().min(1, 'Plan type is required').transform((val) => parseInt(val)).refine((value) => !isNaN(value) && value > 0, {
    message: 'Plan type must be a positive number',
  }),
  isActive: z.boolean().default(true),
  communityStartDate: z.date().optional(),
});

export function CreateCommunityForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createCommunitySchema),
    // Generate the default values object from the schema
    defaultValues: {
      name: '',
      description: '',
      visibility: 'public',
      contributionFrequency: 'monthly',
      country: 'CANADA',
      currency: 'CAD',
      targetAmount: "0.00",
      planType: "",
      isActive: true,
      communityStartDate: new Date(),
    },
    mode: 'onSubmit',
  });

  async function onSubmit(data: z.infer<typeof createCommunitySchema>) {
    setIsLoading(true);
    // TODO: Add actual API call here
    const { success, message, data: createdCommunity } = await createCommunity({ ...data, communityStartDate: data.communityStartDate as Date });
    if (!success) {
      toast.error(message || 'Failed to create community');
    } else {
      toast.success('Community created successfully');
      form.reset()
      await authClient.organization.setActive({
        organizationId: createdCommunity?.id as string
      })
      setIsLoading(false);
      setOpen(false)
      router.refresh();
    }

  }

  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await getPlans();
      setPlans(plans);
    };
    fetchPlans();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UsersRound className="mr-2 h-4 w-4" />Create Community
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create community</DialogTitle>
          <DialogDescription>
            Add a new community to manage members and contributions.
          </DialogDescription>
        </DialogHeader>
        <Card className="bg-white">
          {/* <CardHeader>
            <CardTitle>Community Details</CardTitle>
          </CardHeader> */}
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup className="gap-2">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Community Name *</FieldLabel>
                      <FieldContent>
                        <Input type="text" id={field.name} {...field} />
                      </FieldContent>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                      <FieldDescription>
                        Choose a unique name for your community.
                      </FieldDescription>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Description</FieldLabel>
                      <FieldContent>
                        <Textarea  {...field} />
                      </FieldContent>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                      <FieldDescription>
                        A brief description of your community.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="visibility"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Visibility</FieldLabel>
                        <FieldContent>
                          <Select name="visibility" disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="unlisted">Unlisted</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                      </Field>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="contributionFrequency"
                    defaultValue={form.getValues('contributionFrequency')}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Contribution Frequency *</FieldLabel>
                        <FieldContent>
                          <Select name="contributionFrequency" disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                              <SelectItem value="one-time">One-time</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                      </Field>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="country"
                    defaultValue="CANADA"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Country *</FieldLabel>
                        <FieldContent>
                          <Select name="country" disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CANADA">CANADA</SelectItem>
                              <SelectItem value="UNITED_STATES">UNITED_STATES</SelectItem>
                              <SelectItem value="UNITED_KINGDOM">UNITED_KINGDOM</SelectItem>
                              <SelectItem value="EUROZONE">EUROZONE</SelectItem>
                              <SelectItem value="KENYA">KENYA</SelectItem>
                              <SelectItem value="NIGERIA">NIGERIA</SelectItem>
                              <SelectItem value="SOUTH_AFRICA">SOUTH_AFRICA</SelectItem>
                              <SelectItem value="GHANA">GHANA</SelectItem>
                              <SelectItem value="TANZANIA">TANZANIA</SelectItem>
                              <SelectItem value="UGANDA">UGANDA</SelectItem>
                              <SelectItem value="RWANDA">RWANDA</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                      </Field>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="currency"
                    defaultValue="CAD"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Currency *</FieldLabel>
                        <FieldContent>
                          <Select name="currency" disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="KES">KES</SelectItem>
                              <SelectItem value="NGN">NGN</SelectItem>
                              <SelectItem value="ZAR">ZAR</SelectItem>
                              <SelectItem value="GHS">GHS</SelectItem>
                              <SelectItem value="TZS">TZS</SelectItem>
                              <SelectItem value="UGX">UGX</SelectItem>
                              <SelectItem value="RWF">RWF</SelectItem>
                              <SelectItem value="CAD">CAD</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                      </Field>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="planType"
                    defaultValue={form.getValues('planType')}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Plan Type *</FieldLabel>
                        <FieldContent>
                          <Select name="planType" disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value.toString()}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select plan type" />
                            </SelectTrigger>
                            <SelectContent>
                              {plans?.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                  {plan.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                      </Field>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    control={form.control}
                    name="communityStartDate"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Community Start Date</FieldLabel>
                        <FieldContent>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? format(field.value, 'PP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>

                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date('1900-01-01')}
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
              <Controller
                control={form.control}
                name="targetAmount"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Target Amount *</FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        placeholder="0.00"
                      />
                    </FieldContent>
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    <FieldDescription>
                      The target amount for this community.
                    </FieldDescription>
                  </Field>
                )}
              />

              <Field orientation="horizontal">
                <Button type="submit" disabled={isLoading}>
                  <LoadingSwap isLoading={isLoading}>Create</LoadingSwap>
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setOpen(false);
                  router.refresh();
                }} disabled={isLoading}>
                  Cancel
                </Button>
              </Field>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
