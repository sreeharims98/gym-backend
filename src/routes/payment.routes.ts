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

// Dashboard and reports
router.get('/dashboard/overdue', getOverdueDashboardController);
router.get('/dashboard/stats', getPaymentStatsController);

// Individual WhatsApp reminders
router.get('/reminder/:id/whatsapp', validate(getPaymentSchema), getWhatsAppReminderController);

// Collections and Renewals
router.post('/pay/:id', validate(getPaymentSchema), validate(recordPaymentSchema), payPaymentController);
router.post('/renew/:id', validate(getPaymentSchema), validate(renewMembershipSchema), renewMembershipController);

export default router;
