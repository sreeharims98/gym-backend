import { Todo as PrismaTodo } from '../generated/prisma/client';

export type Todo = PrismaTodo;

export interface CreateTodoDTO {
  title: string;
  content?: string;
}

export interface UpdateTodoDTO {
  title?: string;
  content?: string;
  is_completed?: boolean;
}
