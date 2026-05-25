import { prisma } from "../config/prisma";
import { Todo, CreateTodoDTO, UpdateTodoDTO } from "../models/todo.model";

export const createTodoRepository = async (
  data: CreateTodoDTO,
): Promise<Todo> => {
  return prisma.todo.create({
    data: {
      title: data.title,
      content: data.content || null,
    },
  });
};

export const findAllTodosRepository = async (): Promise<Todo[]> => {
  return prisma.todo.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
};

export const findTodoByIdRepository = async (
  id: number,
): Promise<Todo | null> => {
  return prisma.todo.findUnique({
    where: { id },
  });
};

export const updateTodoRepository = async (
  id: number,
  data: UpdateTodoDTO,
): Promise<Todo | null> => {
  try {
    return await prisma.todo.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        is_completed: data.is_completed,
      },
    });
  } catch (error) {
    return null;
  }
};

export const deleteTodoRepository = async (id: number): Promise<boolean> => {
  try {
    await prisma.todo.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};
