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

// Staff and Owners can view members and register/renew
router.get('/', validate(listMembersQuerySchema), getAllMembersController);
router.get('/:id', validate(getMemberSchema), getMemberByIdController);
router.post('/', validate(registerMemberSchema), registerMemberController);
router.put('/:id', validate(getMemberSchema), validate(updateMemberSchema), updateMemberController);
router.delete('/:id', validate(getMemberSchema), deleteMemberController);

export default router;
