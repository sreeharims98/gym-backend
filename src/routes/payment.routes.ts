import { Router } from 'express';
import {
  payPaymentController,
  renewMembershipController,
  getOverdueDashboardController,
  getPaymentStatsController,
  getWhatsAppReminderController,
} from '../controllers/payment.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { recordPaymentSchema, renewMembershipSchema, getPaymentSchema } from '../validators/payment.validator';

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

/**
 * @openapi
 * /api/payments/dashboard/overdue:
 *   get:
 *     tags:
 *       - Payments & Dashboards
 *     summary: Overdue and Due Membership Dashboard (Owner & Staff)
 *     description: Segments unpaid/partial invoices into 'due_today', 'due_this_week', and 'overdue' categories. Features delay day counts, and click-to-send prefilled WhatsApp link redirection payloads.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: gym_id
 *         in: query
 *         description: Filter dashboard by Branch ID (optional for Owners, automatic for Staff)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Segmented dashboard lists
 */
router.get('/dashboard/overdue', getOverdueDashboardController);

/**
 * @openapi
 * /api/payments/dashboard/stats:
 *   get:
 *     tags:
 *       - Payments & Dashboards
 *     summary: Reports and Revenue Statistics (Owner & Staff)
 *     description: Calculates aggregated parameters (total collected, total pending, active member count, overdue count, and branch revenue rollup lists).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: gym_id
 *         in: query
 *         description: Filter stats by Branch ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: System metrics aggregation
 */
router.get('/dashboard/stats', getPaymentStatsController);

/**
 * @openapi
 * /api/payments/reminder/{id}/whatsapp:
 *   get:
 *     tags:
 *       - Payments & Dashboards
 *     summary: Get prefilled click-to-send WhatsApp reminder text & redirection link
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prefilled message text copy and wa.me click link redirection
 */
router.get('/reminder/:id/whatsapp', validate(getPaymentSchema), getWhatsAppReminderController);

/**
 * @openapi
 * /api/payments/pay/{id}:
 *   post:
 *     tags:
 *       - Payments & Dashboards
 *     summary: Log a fee payment/collection
 *     description: Records collection amount for an invoice, updates balances, and automatically activates the member on complete settlement.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true,
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount_paid
 *             properties:
 *               amount_paid:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       200:
 *         description: Payment registered and balances updated successfully
 */
router.post('/pay/:id', validate(getPaymentSchema), validate(recordPaymentSchema), payPaymentController);

/**
 * @openapi
 * /api/payments/renew/{id}:
 *   post:
 *     tags:
 *       - Payments & Dashboards
 *     summary: Renew gym membership (Owner & Staff)
 *     description: Extends a member's package, shifts their profile status to Active, and atomicly posts a new unpaid Payment invoice for billing.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true,
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_id
 *             properties:
 *               plan_id:
 *                 type: integer
 *                 example: 2
 *               payment_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-25"
 *     responses:
 *       201:
 *         description: Membership package renewed successfully
 */
router.post('/renew/:id', validate(getPaymentSchema), validate(renewMembershipSchema), renewMembershipController);

export default router;
