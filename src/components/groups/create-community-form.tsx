'use client';

// External libraries
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Lucide
import { CalendarIcon } from 'lucide-react';

// App/utilities
import { cn } from '@/lib/utils';
import { getPlans } from '@/app/actions/community';
import { Plan } from '@/drizzle/schema';

// UI components
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { FieldGroup } from '../ui/field';
import { useSession } from '@/lib/auth-client';

export const createCommunitySchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  visibility: z.enum(['public', 'private', 'unlisted'], {
    message: 'Please select a valid visibility option',
  }),
  contribution_frequency: z.enum(['monthly', 'annual', 'one-time']).default('monthly'),
  currency: z
    .enum(['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'GHS', 'TZS', 'UGX', 'RWF', 'CAD'])
    .default('CAD'),
  target_amount: z
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
  plan_type: z.number().int().min(1, 'Plan type is required'),
  is_active: z.boolean().default(true),
  community_start_date: z.date().optional(),
});

type CreateCommunitySchemaType = z.infer<typeof createCommunitySchema>;

export function CreateCommunityForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const router = useRouter();
  const session = useSession();
  const form = useForm<any>({
    resolver: zodResolver(createCommunitySchema),
    // Generate the default values object from the schema
    defaultValues: {
      name: '',
      description: '',
      visibility: 'public',
      contribution_frequency: '',
      country: 'CANADA',
      currency: 'CAD',
      target_amount: 0,
      plan_type: 1,
      is_active: true,
      community_start_date: new Date(),
    },
  });

  const onSubmit = (data: CreateCommunitySchemaType) => {
    console.log(session.data?.user);
    if (session.data?.user?.emailVerified) {
      const communityData = {
        ...data,
        admin_id: session.data?.user?.id,
        admin_email: session.data?.user?.email,
      }
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await getPlans();
      setPlans(plans);
    };
    fetchPlans();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Name *</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Family Savings Group" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="A brief description of your savings group" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <Select name="visibility" disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="contribution_frequency"
              defaultValue="weekly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contribution Frequency *</FormLabel>
                  <FormControl>
                    <Select name="contributionFrequency" disabled={loading}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Select name="country" disabled={loading}>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency *</FormLabel>
                  <FormControl>
                    <Select name="currency" disabled={loading}>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="plan_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Type *</FormLabel>
                  <FormControl>
                    <Select name="planType" disabled={loading}>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="community_start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Community Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
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
                      </FormControl>
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
                  <FormDescription>
                    When will contributions start for this community?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Community'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
