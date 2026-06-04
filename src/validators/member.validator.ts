import { z } from "zod";

export const registerMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(255).openapi({
      description: "The full name of the gym member",
      example: "John Doe",
    }),
    phone: z.string().min(1, "Phone number is required").max(50).openapi({
      description: "Member contact phone number",
      example: "+91 98765 43210",
    }),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .nullable()
      .openapi({
        description: "Member email address (optional)",
        example: "john@gmail.com",
      }),
    address: z.string().max(500).optional().nullable().openapi({
      description: "Member physical address details",
      example: "Adyar, Chennai",
    }),
    join_date: z
      .string()
      .datetime({ message: "Join date must be a valid ISO 8601 date string" })
      .or(
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Join date must be YYYY-MM-DD"),
      )
      .openapi({
        description:
          "ISO Date string or YYYY-MM-DD when the member joins the branch",
        example: "2026-05-25",
      }),
    emergency_contact: z
      .string()
      .min(1, "Emergency contact is required")
      .max(255)
      .openapi({
        description: "Emergency contact coordinates and contact details",
        example: "Jane Doe (+91 99999 88888)",
      }),
    photo_url: z
      .string()
      .url("Invalid photo URL")
      .optional()
      .nullable()
      .openapi({
        description: "URL of the member photo profile",
        example: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
      }),
    height: z
      .number()
      .positive("Height must be a positive number")
      .optional()
      .nullable()
      .openapi({
        description: "Optional member height measurement in centimeters (cm)",
        example: 178.5,
      }),
    weight: z
      .number()
      .positive("Weight must be a positive number")
      .optional()
      .nullable()
      .openapi({
        description: "Optional member weight measurement in kilograms (kg)",
        example: 72.3,
      }),
    gym_id: z
      .number()
      .int()
      .positive("Gym ID must be a positive integer")
      .openapi({
        description: "Branch ID relationship assigning the member to a gym",
        example: 1,
      }),
    plan_id: z
      .number()
      .int()
      .positive("Plan ID must be a positive integer")
      .openapi({
        description: "Initial Membership dynamic Plan ID selection",
        example: 1,
      }),
    registration_fee: z
      .number()
      .nonnegative("Registration fee must be a non-negative number")
      .optional()
      .openapi({
        description: "Registration fee charged. Omit to use Gym default, or pass 0 for free registration offer.",
        example: 500.0,
      }),
  }),
});

export const updateMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    phone: z.string().min(1).max(50).optional(),
    email: z.string().email("Invalid email address").optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    join_date: z
      .string()
      .datetime()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .optional(),
    emergency_contact: z.string().min(1).max(255).optional(),
    photo_url: z.string().url("Invalid photo URL").optional().nullable(),
    height: z.number().positive().optional().nullable().openapi({
      description: "Member height parameter update in cm",
      example: 179.0,
    }),
    weight: z.number().positive().optional().nullable().openapi({
      description: "Member weight parameter update in kg",
      example: 70.8,
    }),
    status: z.enum(["active", "expired", "pending"]).optional().openapi({
      description: "General system standing status",
      example: "active",
    }),
    gym_id: z.number().int().positive().optional(),
    plan_id: z.number().int().positive().optional(),
  }),
});

export const getMemberSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number").openapi({
      description: "Numeric unique member profile ID",
      example: "1",
    }),
  }),
});

export const listMembersQuerySchema = z.object({
  query: z.object({
    search: z.string().optional().openapi({
      description: "Search string matched against name or phone (insensitive)",
      example: "John",
    }),
    phone: z.string().optional().openapi({
      description: "Filter search by direct phone match",
      example: "9876543210",
    }),
    gym_id: z.string().regex(/^\d+$/).optional().openapi({
      description: "Filter list by branch assignment ID",
      example: "1",
    }),
    status: z.enum(["active", "expired", "pending"]).optional().openapi({
      description: "Filter list by member standings",
      example: "active",
    }),
  }),
});
