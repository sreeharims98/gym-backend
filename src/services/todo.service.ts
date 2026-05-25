import {
  createTodoRepository,
  findAllTodosRepository,
  findTodoByIdRepository,
  updateTodoRepository,
  deleteTodoRepository,
} from "../repositories/todo.repository";
import { CreateTodoDTO, UpdateTodoDTO, Todo } from "../models/todo.model";

export const createTodo = async (data: CreateTodoDTO): Promise<Todo> => {
  return createTodoRepository(data);
};

export const getAllTodos = async (): Promise<Todo[]> => {
  return findAllTodosRepository();
};

export const getTodoById = async (id: number): Promise<Todo | null> => {
  return findTodoByIdRepository(id);
};

export const updateTodo = async (
  id: number,
  data: UpdateTodoDTO,
): Promise<Todo | null> => {
  const existing = await findTodoByIdRepository(id);
  if (!existing) return null;
  return updateTodoRepository(id, data);
};

export const deleteTodo = async (id: number): Promise<boolean> => {
  return deleteTodoRepository(id);
};
