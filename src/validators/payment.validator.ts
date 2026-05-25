import { z } from 'zod';

export const recordPaymentSchema = z.object({
  body: z.object({
    amount_paid: z.number().nonnegative('Amount paid must be a positive number or zero'),
  }),
});

export const renewMembershipSchema = z.object({
  body: z.object({
    plan_id: z.number().int().positive('Plan ID must be a positive integer'),
    payment_date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  }),
});

export const getPaymentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});
