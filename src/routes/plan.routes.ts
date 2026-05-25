import { Router } from "express";
import {
  createPlanController,
  getAllPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
} from "../controllers/plan.controller";
import { validate } from "../middlewares/validate";
import { authenticate, requireRole } from "../middlewares/auth";
import {
  createPlanSchema,
  updatePlanSchema,
  getPlanSchema,
} from "../validators/plan.validator";
import { registry } from "../config/swaggerRegistry";

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

// Programmatically register membership plan endpoints
registry.registerPath({
  method: "get",
  path: "/api/plans",
  summary: "List all plans (Owner & Staff)",
  description:
    "Fetches all dynamic packages (Monthly, 3 Months, Yearly, etc.).",
  tags: ["Membership Plans"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "List of preconfigured dynamic plans",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/plans/{id}",
  summary: "Get plan details by ID (Owner & Staff)",
  description:
    "Returns specific duration and price details of a membership package.",
  tags: ["Membership Plans"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPlanSchema.shape.params,
  },
  responses: {
    200: {
      description: "Plan details",
    },
    404: {
      description: "Plan not found",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/plans",
  summary: "Create dynamic membership plan (Owner only)",
  description:
    "Adds a new dynamic pricing package. Restricted to Owner privileges.",
  tags: ["Membership Plans"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createPlanSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Plan created successfully",
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/plans/{id}",
  summary: "Update plan details (Owner only)",
  description:
    "Updates price or period validity for a specific dynamic package.",
  tags: ["Membership Plans"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPlanSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: updatePlanSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Plan details updated",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/plans/{id}",
  summary: "Delete plan (Owner only)",
  description: "Removes a membership plan from system options.",
  tags: ["Membership Plans"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPlanSchema.shape.params,
  },
  responses: {
    204: {
      description: "Plan deleted successfully",
    },
  },
});

router.get("/", getAllPlansController);
router.get("/:id", validate(getPlanSchema), getPlanByIdController);
router.post(
  "/",
  requireRole("owner"),
  validate(createPlanSchema),
  createPlanController,
);
router.put(
  "/:id",
  requireRole("owner"),
  validate(getPlanSchema),
  validate(updatePlanSchema),
  updatePlanController,
);
router.delete(
  "/:id",
  requireRole("owner"),
  validate(getPlanSchema),
  deletePlanController,
);

export default router;
