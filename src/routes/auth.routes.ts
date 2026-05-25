import { Router } from 'express';
import { registerController, loginController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/user.validator';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

export default router;
