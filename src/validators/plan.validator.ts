import { z } from 'zod';

export const createPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Plan name is required').max(100),
    duration_months: z.number().int().positive('Duration must be a positive integer'),
    price: z.number().positive('Price must be a positive number'),
  }),
});

export const updatePlanSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    duration_months: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
  }),
});

export const getPlanSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});
