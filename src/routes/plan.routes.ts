import { Router } from 'express';
import {
  createPlanController,
  getAllPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
} from '../controllers/plan.controller';
import { validate } from '../middlewares/validate';
import { authenticate, requireRole } from '../middlewares/auth';
import { createPlanSchema, updatePlanSchema, getPlanSchema } from '../validators/plan.validator';

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

// Staff and Owners can view membership options
router.get('/', getAllPlansController);
router.get('/:id', validate(getPlanSchema), getPlanByIdController);

// Only Gym Owners can manage plans (create, update, delete)
router.post('/', requireRole('owner'), validate(createPlanSchema), createPlanController);
router.put('/:id', requireRole('owner'), validate(getPlanSchema), validate(updatePlanSchema), updatePlanController);
router.delete('/:id', requireRole('owner'), validate(getPlanSchema), deletePlanController);

export default router;
