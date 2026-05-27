import { prisma } from "../config/prisma";
import { Plan, CreatePlanDTO, UpdatePlanDTO } from "../models/plan.model";

export const createPlanRepository = async (
  data: CreatePlanDTO,
): Promise<Plan> => {
  return prisma.plan.create({
    data: {
      name: data.name,
      duration_months: data.duration_months,
      price: data.price,
    },
  });
};

export const findAllPlansRepository = async (): Promise<Plan[]> => {
  return prisma.plan.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      duration_months: "asc",
    },
  });
};

export const findPlanByIdRepository = async (
  id: number,
): Promise<Plan | null> => {
  return prisma.plan.findUnique({
    where: { id },
  });
};

export const updatePlanRepository = async (
  id: number,
  data: UpdatePlanDTO,
): Promise<Plan | null> => {
  try {
    return await prisma.plan.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
};

export const deletePlanRepository = async (id: number): Promise<boolean> => {
  try {
    await prisma.plan.update({
      where: { id },
      data: { is_active: false },
    });
    return true;
  } catch (error) {
    return false;
  }
};
