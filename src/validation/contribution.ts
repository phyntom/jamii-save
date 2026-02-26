import { z } from 'zod';

const CurrencySchema = z.enum([
  'USD',
  'EUR',
  'GBP',
  'KES',
  'NGN',
  'ZAR',
  'GHS',
  'TZS',
  'UGX',
  'RWF',
  'CAD',
]);

export type Currency = z.infer<typeof CurrencySchema>;

export const recordContributionSchema = z.object({
  groupId: z.string(),
  referenceNumber: z.string(),
  contributionType: z
    .enum(['standard_contribution', 'loan_payment', 'social_activities', 'emergency_fund', 'other'])
    .default('standard_contribution'),
  amount: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((value) => !isNaN(value) && value > 0, {
      message: 'Contribution amount must be a positive number',
    })
    .refine((value) => {
      const cents = value * 100;
      return Number.isInteger(cents);
    }),
  paymentMethod: z
    .enum(['bank_deposit', 'mobile_money', 'cash', 'credit_card', 'interac', 'paypal'])
    .default('cash'),
  currency: CurrencySchema.default('CAD'),
  contributionDate: z.date(),
  contributionPeriod: z.string(),
  notes: z.string().optional(),
});
