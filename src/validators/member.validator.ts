import { z } from 'zod';

export const registerMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    phone: z.string().min(1, 'Phone number is required').max(50),
    email: z.string().email('Invalid email address').optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    join_date: z.string().datetime({ message: 'Join date must be a valid ISO 8601 date string' }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Join date must be YYYY-MM-DD')),
    emergency_contact: z.string().min(1, 'Emergency contact is required').max(255),
    photo_url: z.string().url('Invalid photo URL').optional().nullable(),
    height: z.number().positive('Height must be a positive number').optional().nullable(),
    weight: z.number().positive('Weight must be a positive number').optional().nullable(),
    gym_id: z.number().int().positive('Gym ID must be a positive integer'),
    plan_id: z.number().int().positive('Plan ID must be a positive integer'),
  }),
});

export const updateMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    phone: z.string().min(1).max(50).optional(),
    email: z.string().email('Invalid email address').optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    join_date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    emergency_contact: z.string().min(1).max(255).optional(),
    photo_url: z.string().url('Invalid photo URL').optional().nullable(),
    height: z.number().positive().optional().nullable(),
    weight: z.number().positive().optional().nullable(),
    status: z.enum(['active', 'expired', 'pending']).optional(),
    gym_id: z.number().int().positive().optional(),
    plan_id: z.number().int().positive().optional(),
  }),
});

export const getMemberSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export const listMembersQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    phone: z.string().optional(),
    gym_id: z.string().regex(/^\d+$/).optional(),
    status: z.enum(['active', 'expired', 'pending']).optional(),
  }),
});
