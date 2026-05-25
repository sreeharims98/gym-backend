import { Router } from 'express';
import {
  createTodoController,
  getAllTodosController,
  getTodoByIdController,
  updateTodoController,
  deleteTodoController
} from '../controllers/todo.controller';
import { validate } from '../middlewares/validate';
import { createTodoSchema, updateTodoSchema, getTodoSchema } from '../validators/todo.validator';

const router = Router();

router.post('/', validate(createTodoSchema), createTodoController);
router.get('/', getAllTodosController);
router.get('/:id', validate(getTodoSchema), getTodoByIdController);
router.put('/:id', validate(updateTodoSchema), updateTodoController);
router.delete('/:id', validate(getTodoSchema), deleteTodoController);

export default router;
