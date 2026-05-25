import { Router } from "express";
import {
  registerController,
  loginController,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validators/user.validator";
import { registry } from "../config/swaggerRegistry";

const router = Router();

// Programmatically register auth/register endpoint
registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  summary: "Register a new Operator (Owner or Staff)",
  description:
    "Creates a new system operator. Owners can manage all branches, while Staff are restricted to their specific branch.",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Operator registered successfully",
    },
    400: {
      description: "Validation failed or email already exists",
    },
  },
});

// Programmatically register auth/login endpoint
registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  summary: "Log in as Operator",
  description:
    "Verifies credentials and issues a custom JWT signature token loaded with operator metadata.",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful, returns token",
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

export default router;
