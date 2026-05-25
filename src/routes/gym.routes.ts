import { Router } from "express";
import {
  createGymController,
  getAllGymsController,
  getGymByIdController,
  updateGymController,
  deleteGymController,
} from "../controllers/gym.controller";
import { validate } from "../middlewares/validate";
import { authenticate, requireRole } from "../middlewares/auth";
import {
  createGymSchema,
  updateGymSchema,
  getGymSchema,
} from "../validators/gym.validator";
import { registry } from "../config/swaggerRegistry";

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

// Programmatically register branch endpoints
registry.registerPath({
  method: "get",
  path: "/api/gyms",
  summary: "List all gym branches (Owner & Staff)",
  description: "Returns all gym locations registered in the system.",
  tags: ["Gym Branches"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of registered gym branches",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/gyms/{id}",
  summary: "Get branch details by ID (Owner & Staff)",
  description: "Returns complete properties of a specific gym branch.",
  tags: ["Gym Branches"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getGymSchema.shape.params,
  },
  responses: {
    200: {
      description: "Branch details",
    },
    404: {
      description: "Branch not found",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/gyms",
  summary: "Create a new branch (Owner only)",
  description: "Registers a new gym location. Restricted to Owner privileges.",
  tags: ["Gym Branches"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createGymSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Branch created successfully",
    },
    403: {
      description: "Forbidden: Owner role required",
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/gyms/{id}",
  summary: "Update branch details (Owner only)",
  description: "Updates specific location or name coordinates for a branch.",
  tags: ["Gym Branches"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getGymSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: updateGymSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Branch updated successfully",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/gyms/{id}",
  summary: "Delete branch (Owner only)",
  description: "Removes a branch location record from the database.",
  tags: ["Gym Branches"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getGymSchema.shape.params,
  },
  responses: {
    204: {
      description: "Branch deleted successfully",
    },
  },
});

router.get("/", getAllGymsController);
router.get("/:id", validate(getGymSchema), getGymByIdController);
router.post(
  "/",
  requireRole("owner"),
  validate(createGymSchema),
  createGymController,
);
router.put(
  "/:id",
  requireRole("owner"),
  validate(getGymSchema),
  validate(updateGymSchema),
  updateGymController,
);
router.delete(
  "/:id",
  requireRole("owner"),
  validate(getGymSchema),
  deleteGymController,
);

export default router;
