import { Router } from 'express';
import { registerController, loginController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/user.validator';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new Operator (Owner or Staff)
 *     requestBody:
 *       required: true,
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: owner@gym.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: secure123
 *               role:
 *                 type: string
 *                 enum: [owner, staff]
 *                 example: owner
 *               gym_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Operator registered successfully
 *       400:
 *         description: Validation failed
 */
router.post('/register', validate(registerSchema), registerController);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in as Operator
 *     requestBody:
 *       required: true,
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: owner@gym.com
 *               password:
 *                 type: string
 *                 example: secure123
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), loginController);

export default router;
