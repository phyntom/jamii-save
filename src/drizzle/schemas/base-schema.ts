import { pgSchema } from 'drizzle-orm/pg-core';

export const baseSchema = pgSchema('jamii');

export const currencyEnum = baseSchema.enum('currency', [
  'CAD',
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
]);
