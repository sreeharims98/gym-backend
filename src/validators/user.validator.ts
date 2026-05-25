import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").openapi({
      description: "Unique operator email address",
      example: "owner@gym.com",
    }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .openapi({
        description: "Operator account password (minimum 6 characters)",
        example: "secure123",
      }),
    role: z.enum(["owner", "staff"]).openapi({
      description: "Operator role permissions level",
      example: "owner",
    }),
    gym_id: z.number().int().positive().optional().nullable().openapi({
      description:
        "Assigned Gym branch ID. Optional for Owners, required for Receptionist Staff.",
      example: null,
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").openapi({
      description: "Registered operator email address",
      example: "owner@gym.com",
    }),
    password: z.string().min(1, "Password is required").openapi({
      description: "Operator account password",
      example: "secure123",
    }),
  }),
});
