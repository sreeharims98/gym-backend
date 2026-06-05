import { Router } from "express";
import {
  renewMembershipController,
  getOverdueDashboardController,
  getPaymentStatsController,
  getWhatsAppReminderController,
} from "../controllers/payment.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";
import {
  renewMembershipSchema,
  getPaymentSchema,
  getStatsQuerySchema,
} from "../validators/payment.validator";
import { getMemberSchema } from "../validators/member.validator";
import { registry } from "../config/swaggerRegistry";

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

// Programmatically register payment and stats endpoints
registry.registerPath({
  method: "get",
  path: "/api/payments/dashboard/overdue",
  summary: "Overdue and Due Membership Dashboard (Owner & Staff)",
  description:
    "Segments unpaid/partial invoices into 'due_today', 'due_this_week', and 'overdue' categories. Features delay day counts, and click-to-send prefilled WhatsApp link redirection payloads.",
  tags: ["Payments & Dashboards"],
  security: [{ bearerAuth: [] }],
  request: {
    query: getStatsQuerySchema.shape.query,
  },
  responses: {
    200: {
      description: "Segmented dashboard lists with WhatsApp redirect keys",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/payments/dashboard/stats",
  summary: "Reports and Revenue Statistics (Owner & Staff)",
  description:
    "Calculates aggregated parameters (total collected, total pending, active member count, overdue count, and branch revenue rollup lists).",
  tags: ["Payments & Dashboards"],
  security: [{ bearerAuth: [] }],
  request: {
    query: getStatsQuerySchema.shape.query,
  },
  responses: {
    200: {
      description: "Global and branch revenue aggregates",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/payments/reminder/{id}/whatsapp",
  summary:
    "Get prefilled click-to-send WhatsApp reminder text & redirection link",
  description:
    "Retrieves prefilled message text copy and wa.me click link redirection for a specific invoice ID.",
  tags: ["Payments & Dashboards"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPaymentSchema.shape.params,
  },
  responses: {
    200: {
      description: "Redirection details",
    },
  },
});



registry.registerPath({
  method: "post",
  path: "/api/payments/renew/{id}",
  summary: "Renew gym membership (Owner & Staff)",
  description:
    "Extends a member's package, shifts their profile status to Active, and atomicly posts a new paid Payment record for billing.",
  tags: ["Payments & Dashboards"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getMemberSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: renewMembershipSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Membership package renewed successfully",
    },
  },
});

router.get("/dashboard/overdue", getOverdueDashboardController);
router.get("/dashboard/stats", getPaymentStatsController);
router.get(
  "/reminder/:id/whatsapp",
  validate(getPaymentSchema),
  getWhatsAppReminderController,
);

router.post(
  "/renew/:id",
  validate(getMemberSchema),
  validate(renewMembershipSchema),
  renewMembershipController,
);

export default router;
