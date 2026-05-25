import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/payment.service';
import { AuthenticatedRequest } from '../middlewares/auth';

export const payPaymentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentId = parseInt(req.params.id, 10);
    const updated = await paymentService.recordPayment(paymentId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const renewMembershipController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = parseInt(req.params.id, 10);
    const newInvoice = await paymentService.renewMembership(memberId, req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    next(error);
  }
};

export const getOverdueDashboardController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // If operator is a staff, only show their specific gym branch overdue records.
    // If operator is an owner, they can specify a gym_id in query or get all!
    let gymId: number | undefined;

    if (req.user?.role === 'staff') {
      gymId = req.user.gym_id || undefined;
    } else if (req.user?.role === 'owner' && req.query.gym_id) {
      gymId = parseInt(String(req.query.gym_id), 10);
    }

    const dashboard = await paymentService.getOverdueDashboard(gymId);
    res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let gymId: number | undefined;

    if (req.user?.role === 'staff') {
      gymId = req.user.gym_id || undefined;
    } else if (req.user?.role === 'owner' && req.query.gym_id) {
      gymId = parseInt(String(req.query.gym_id), 10);
    }

    const stats = await paymentService.getPaymentStats(gymId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const getWhatsAppReminderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentId = parseInt(req.params.id, 10);
    const payload = await paymentService.getWhatsAppReminderPayload(paymentId);
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
