import { Router } from 'express';
import {
  createGymController,
  getAllGymsController,
  getGymByIdController,
  updateGymController,
  deleteGymController,
} from '../controllers/gym.controller';
import { validate } from '../middlewares/validate';
import { authenticate, requireRole } from '../middlewares/auth';
import { createGymSchema, updateGymSchema, getGymSchema } from '../validators/gym.validator';

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

// Receptionists (staff) and Owners can view branches
router.get('/', getAllGymsController);
router.get('/:id', validate(getGymSchema), getGymByIdController);

// Only Gym Owners can manage branches (create, update, delete)
router.post('/', requireRole('owner'), validate(createGymSchema), createGymController);
router.put('/:id', requireRole('owner'), validate(getGymSchema), validate(updateGymSchema), updateGymController);
router.delete('/:id', requireRole('owner'), validate(getGymSchema), deleteGymController);

export default router;
