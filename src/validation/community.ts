import { z } from 'zod';

export const createCommunitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
  contribution_frequency: z.string().default('weekly'),
  contribution_amount: z
    .number()
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'Contribution amount must be a positive number',
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
  contribution_day: z.number().int().min(1).max(31).default(1),
  current_member_count: z.number().int().min(0).default(0),
  additional_member_count: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  admin_id: z.string().min(1, 'Admin ID is required'),
  max_members: z.number().int().min(1).default(10),
  plan_id: z.number().int().min(1, 'Plan ID is required'),
});
