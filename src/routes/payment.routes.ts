import { Router } from "express";
import {
  payPaymentController,
  renewMembershipController,
  getOverdueDashboardController,
  getPaymentStatsController,
  getWhatsAppReminderController,
} from "../controllers/payment.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";
import {
  recordPaymentSchema,
  renewMembershipSchema,
  getPaymentSchema,
  getStatsQuerySchema,
} from "../validators/payment.validator";
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
  path: "/api/payments/pay/{id}",
  summary: "Log a fee payment/collection (Owner & Staff)",
  description:
    "Records collection amount for an invoice, updates balances, and automatically activates the member on complete settlement.",
  tags: ["Payments & Dashboards"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPaymentSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: recordPaymentSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Balances settled successfully",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/payments/renew/{id}",
  summary: "Renew gym membership (Owner & Staff)",
  description:
    "Extends a member's package, shifts their profile status to Active, and atomicly posts a new unpaid Payment invoice for billing.",
  tags: ["Payments & Dashboards"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getPaymentSchema.shape.params,
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
  "/pay/:id",
  validate(getPaymentSchema),
  validate(recordPaymentSchema),
  payPaymentController,
);
router.post(
  "/renew/:id",
  validate(getPaymentSchema),
  validate(renewMembershipSchema),
  renewMembershipController,
);

export default router;
