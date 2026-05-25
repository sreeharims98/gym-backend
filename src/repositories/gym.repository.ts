import { prisma } from '../config/prisma';
import { Gym, CreateGymDTO, UpdateGymDTO } from '../models/gym.model';

export const createGymRepository = async (data: CreateGymDTO): Promise<Gym> => {
  return prisma.gym.create({
    data: {
      name: data.name,
      location: data.location,
      contact_no: data.contact_no,
    },
  });
};

export const findAllGymsRepository = async (): Promise<Gym[]> => {
  return prisma.gym.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const findGymByIdRepository = async (id: number): Promise<Gym | null> => {
  return prisma.gym.findUnique({
    where: { id },
  });
};

export const updateGymRepository = async (id: number, data: UpdateGymDTO): Promise<Gym | null> => {
  try {
    return await prisma.gym.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
};

export const deleteGymRepository = async (id: number): Promise<boolean> => {
  try {
    await prisma.gym.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};
