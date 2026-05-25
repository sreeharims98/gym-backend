import { z } from "zod";

export const recordPaymentSchema = z.object({
  body: z.object({
    amount_paid: z
      .number()
      .nonnegative("Amount paid must be a positive number or zero")
      .openapi({
        description: "The amount of cash/payment collected for this invoice",
        example: 1500.0,
      }),
  }),
});

export const renewMembershipSchema = z.object({
  body: z.object({
    plan_id: z
      .number()
      .int()
      .positive("Plan ID must be a positive integer")
      .openapi({
        description:
          "The newly selected dynamic membership package ID to assign",
        example: 2,
      }),
    payment_date: z
      .string()
      .datetime()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .optional()
      .openapi({
        description:
          "The base activation payment date (optional, defaults to now)",
        example: "2026-05-25",
      }),
  }),
});

export const getPaymentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number").openapi({
      description: "Numeric unique invoice/payment ID",
      example: "1",
    }),
  }),
});

export const getStatsQuerySchema = z.object({
  query: z.object({
    gym_id: z.string().regex(/^\d+$/).optional().openapi({
      description: "Filter statistics or dashboard by Branch ID",
      example: "1",
    }),
  }),
});
