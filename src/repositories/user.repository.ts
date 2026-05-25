import { prisma } from '../config/prisma';
import { User, RegisterUserDTO } from '../models/user.model';

export const createUserRepository = async (data: RegisterUserDTO & { password_hash: string }): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password_hash,
      role: data.role,
      gym_id: data.gym_id || null,
    },
  });
};

export const findUserByEmailRepository = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByIdRepository = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};
