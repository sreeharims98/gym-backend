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

/**
 * @openapi
 * /api/gyms:
 *   get:
 *     tags:
 *       - Gym Branches
 *     summary: List all gym branches (Owner & Staff)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registered gym branches
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllGymsController);

/**
 * @openapi
 * /api/gyms/{id}:
 *   get:
 *     tags:
 *       - Gym Branches
 *     summary: Get branch details by ID
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
 *         description: Branch details
 *       404:
 *         description: Branch not found
 */
router.get('/:id', validate(getGymSchema), getGymByIdController);

/**
 * @openapi
 * /api/gyms:
 *   post:
 *     tags:
 *       - Gym Branches
 *     summary: Create a new branch (Owner only)
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
 *               - location
 *               - contact_no
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chennai Branch
 *               location:
 *                 type: string
 *                 example: Adyar, Chennai
 *               contact_no:
 *                 type: string
 *                 example: +91 98765 43210
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       403:
 *         description: Forbidden (Owner privilege required)
 */
router.post('/', requireRole('owner'), validate(createGymSchema), createGymController);

/**
 * @openapi
 * /api/gyms/{id}:
 *   put:
 *     tags:
 *       - Gym Branches
 *     summary: Update branch details (Owner only)
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
 *               name:
 *                 type: string
 *                 example: Chennai Main Branch
 *     responses:
 *       200:
 *         description: Branch updated successfully
 */
router.put('/:id', requireRole('owner'), validate(getGymSchema), validate(updateGymSchema), updateGymController);

/**
 * @openapi
 * /api/gyms/{id}:
 *   delete:
 *     tags:
 *       - Gym Branches
 *     summary: Delete branch (Owner only)
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
 *         description: Branch deleted successfully
 */
router.delete('/:id', requireRole('owner'), validate(getGymSchema), deleteGymController);

export default router;
