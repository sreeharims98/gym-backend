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

/**
 * @openapi
 * /api/plans:
 *   get:
 *     tags:
 *       - Membership Plans
 *     summary: List all plans (Owner & Staff)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of dynamic plans
 */
router.get('/', getAllPlansController);

/**
 * @openapi
 * /api/plans/{id}:
 *   get:
 *     tags:
 *       - Membership Plans
 *     summary: Get plan details by ID
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
 *         description: Plan details
 *       404:
 *         description: Plan not found
 */
router.get('/:id', validate(getPlanSchema), getPlanByIdController);

/**
 * @openapi
 * /api/plans:
 *   post:
 *     tags:
 *       - Membership Plans
 *     summary: Create dynamic membership plan (Owner only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true,
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration_months
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Monthly Package
 *               duration_months:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Plan created successfully
 */
router.post('/', requireRole('owner'), validate(createPlanSchema), createPlanController);

/**
 * @openapi
 * /api/plans/{id}:
 *   put:
 *     tags:
 *       - Membership Plans
 *     summary: Update plan pricing/details (Owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 1300
 *     responses:
 *       200:
 *         description: Plan updated
 */
router.put('/:id', requireRole('owner'), validate(getPlanSchema), validate(updatePlanSchema), updatePlanController);

/**
 * @openapi
 * /api/plans/{id}:
 *   delete:
 *     tags:
 *       - Membership Plans
 *     summary: Delete plan (Owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Plan deleted
 */
router.delete('/:id', requireRole('owner'), validate(getPlanSchema), deletePlanController);

export default router;
