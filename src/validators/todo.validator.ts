import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).min(1, 'Title cannot be empty').max(255, 'Title must be less than 255 characters'),
    content: z.string().optional(),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Id must be a numeric string'),
  }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().optional(),
    is_completed: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  }),
});

export const getTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Id must be a numeric string'),
  }),
});
