import { z } from 'zod';

export const createGymSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Gym name is required').max(255),
    location: z.string().min(1, 'Location is required').max(255),
    contact_no: z.string().min(1, 'Contact number is required').max(50),
  }),
});

export const updateGymSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    location: z.string().min(1).max(255).optional(),
    contact_no: z.string().min(1).max(50).optional(),
  }),
});

export const getGymSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});
