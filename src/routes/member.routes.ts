import { Router } from "express";
import {
  registerMemberController,
  getAllMembersController,
  getMemberByIdController,
  updateMemberController,
  deleteMemberController,
  assignPlanController,
} from "../controllers/member.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";
import {
  registerMemberSchema,
  updateMemberSchema,
  getMemberSchema,
  listMembersQuerySchema,
  assignPlanSchema,
} from "../validators/member.validator";
import { registry } from "../config/swaggerRegistry";

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

// Programmatically register member routes
registry.registerPath({
  method: "get",
  path: "/api/members",
  summary: "Search & Filter gym members (Owner & Staff)",
  description:
    "Returns members matched against filters like phone, gym_id, status, or search query.",
  tags: ["Members Management"],
  security: [{ bearerAuth: [] }],
  request: {
    query: listMembersQuerySchema.shape.query,
  },
  responses: {
    200: {
      description: "List of matched members",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/members/{id}",
  summary: "Get complete member profile & bill history",
  description: "Returns member parameters and complete historical invoices.",
  tags: ["Members Management"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getMemberSchema.shape.params,
  },
  responses: {
    200: {
      description: "Member complete profile and invoices",
    },
    404: {
      description: "Member not found",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/members",
  summary: "Register a new Gym Member (Owner & Staff)",
  description:
    "Registers a member, computes membership expiry, and atomicly posts their first unpaid invoice.",
  tags: ["Members Management"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerMemberSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Member registered and initial invoice generated",
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/members/{id}",
  summary: "Edit member profile (Owner & Staff)",
  description:
    "Updates specific standing status, emergency contact, or weight/height parameters.",
  tags: ["Members Management"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getMemberSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: updateMemberSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Member details updated",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/members/{id}",
  summary: "Delete member profile record",
  description:
    "Removes a member from the database along with associated payment history.",
  tags: ["Members Management"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getMemberSchema.shape.params,
  },
  responses: {
    204: {
      description: "Member deleted successfully",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/members/{id}/assign-plan",
  summary: "Assign membership plan to a member",
  description:
    "Assigns a plan to a pending member, computes expiry, and atomicly posts their first unpaid invoice.",
  tags: ["Members Management"],
  security: [{ bearerAuth: [] }],
  request: {
    params: assignPlanSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: assignPlanSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Plan assigned and initial invoice generated",
    },
  },
});

router.get("/", validate(listMembersQuerySchema), getAllMembersController);
router.get("/:id", validate(getMemberSchema), getMemberByIdController);
router.post("/", validate(registerMemberSchema), registerMemberController);
router.post(
  "/:id/assign-plan",
  validate(assignPlanSchema),
  assignPlanController,
);
router.put(
  "/:id",
  validate(getMemberSchema),
  validate(updateMemberSchema),
  updateMemberController,
);
router.delete("/:id", validate(getMemberSchema), deleteMemberController);

export default router;
