import { z } from "zod";

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
    payment_date: z.iso
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
