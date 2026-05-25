import { z } from "zod";

export const createPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Plan name is required").max(100).openapi({
      description: "The name of the membership plan package",
      example: "3 Months Package",
    }),
    duration_months: z
      .number()
      .int()
      .positive("Duration must be a positive integer")
      .openapi({
        description: "Package validity timeframe in months",
        example: 3,
      }),
    price: z.number().positive("Price must be a positive number").openapi({
      description: "The pricing of the plan in local currency",
      example: 4500,
    }),
  }),
});

export const updatePlanSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional().openapi({
      description: "Updated package name",
    }),
    duration_months: z.number().int().positive().optional().openapi({
      description: "Updated package validity duration in months",
    }),
    price: z.number().positive().optional().openapi({
      description: "Updated package price amount",
      example: 4200,
    }),
  }),
});

export const getPlanSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number").openapi({
      description: "Numeric unique membership plan ID",
      example: "1",
    }),
  }),
});
