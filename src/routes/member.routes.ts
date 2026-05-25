import { Router } from 'express';
import {
  registerMemberController,
  getAllMembersController,
  getMemberByIdController,
  updateMemberController,
  deleteMemberController,
} from '../controllers/member.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { registerMemberSchema, updateMemberSchema, getMemberSchema, listMembersQuerySchema } from '../validators/member.validator';

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

/**
 * @openapi
 * /api/members:
 *   get:
 *     tags:
 *       - Members Management
 *     summary: Search & Filter gym members (Owner & Staff)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search by name or phone number
 *         schema:
 *           type: string
 *       - name: phone
 *         in: query
 *         description: Match clean phone string
 *         schema:
 *           type: string
 *       - name: gym_id
 *         in: query
 *         description: Filter by Branch ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by membership status
 *         schema:
 *           type: string
 *           enum: [active, expired, pending]
 *     responses:
 *       200:
 *         description: List of members matched against criteria
 */
router.get('/', validate(listMembersQuerySchema), getAllMembersController);

/**
 * @openapi
 * /api/members/{id}:
 *   get:
 *     tags:
 *       - Members Management
 *     summary: Get complete member profile & bill history
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
 *         description: Member profile and invoice tracking details
 *       404:
 *         description: Member not found
 */
router.get('/:id', validate(getMemberSchema), getMemberByIdController);

/**
 * @openapi
 * /api/members:
 *   post:
 *     tags:
 *       - Members Management
 *     summary: Register a new Gym Member (Owner & Staff)
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
 *               - phone
 *               - join_date
 *               - emergency_contact
 *               - gym_id
 *               - plan_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: +91 98765 43210
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               address:
 *                 type: string
 *                 example: Adyar, Chennai
 *               join_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-25"
 *               emergency_contact:
 *                 type: string
 *                 example: Jane Doe (+91 99999 88888)
 *               photo_url:
 *                 type: string
 *                 example: https://images.unsplash.com/photo-1534438327276-14e5300c3a48
 *               height:
 *                 type: number
 *                 example: 178.5
 *               weight:
 *                 type: number
 *                 example: 72.3
 *               gym_id:
 *                 type: integer
 *                 example: 1
 *               plan_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Member registered and first invoice created atomicly
 */
router.post('/', validate(registerMemberSchema), registerMemberController);

/**
 * @openapi
 * /api/members/{id}:
 *   put:
 *     tags:
 *       - Members Management
 *     summary: Edit member profile (Owner & Staff)
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
 *               weight:
 *                 type: number
 *                 example: 70.8
 *     responses:
 *       200:
 *         description: Member details updated
 */
router.put('/:id', validate(getMemberSchema), validate(updateMemberSchema), updateMemberController);

/**
 * @openapi
 * /api/members/{id}:
 *   delete:
 *     tags:
 *       - Members Management
 *     summary: Delete member profile record
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
 *         description: Member deleted successfully
 */
router.delete('/:id', validate(getMemberSchema), deleteMemberController);

export default router;
