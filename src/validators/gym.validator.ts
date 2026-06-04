import { z } from "zod";

export const createGymSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Gym name is required").max(255).openapi({
      description: "The name of the gym branch",
      example: "Chennai Branch",
    }),
    location: z.string().min(1, "Location is required").max(255).openapi({
      description: "The physical location or address of the gym branch",
      example: "Adyar, Chennai",
    }),
    contact_no: z
      .string()
      .min(1, "Contact number is required")
      .max(50)
      .openapi({
        description: "The primary contact number of the branch receptionist",
        example: "+91 98765 43210",
      }),
    registration_fee: z
      .number()
      .nonnegative("Registration fee must be a non-negative number")
      .optional()
      .openapi({
        description: "Default registration fee for the branch",
        example: 500.0,
      }),
  }),
});

export const updateGymSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional().openapi({
      description: "Updated branch name",
      example: "Chennai Main Branch",
    }),
    location: z.string().min(1).max(255).optional().openapi({
      description: "Updated branch address",
    }),
    contact_no: z.string().min(1).max(50).optional().openapi({
      description: "Updated contact details",
    }),
    registration_fee: z
      .number()
      .nonnegative("Registration fee must be a non-negative number")
      .optional()
      .openapi({
        description: "Updated default registration fee for the branch",
        example: 600.0,
      }),
  }),
});

export const getGymSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number").openapi({
      description: "Numeric unique branch ID",
      example: "1",
    }),
  }),
});
