import * as planRepository from '../repositories/plan.repository';
import { Plan, CreatePlanDTO, UpdatePlanDTO } from '../models/plan.model';

export const createPlan = async (data: CreatePlanDTO): Promise<Plan> => {
  return planRepository.createPlanRepository(data);
};

export const getAllPlans = async (): Promise<Plan[]> => {
  return planRepository.findAllPlansRepository();
};

export const getPlanById = async (id: number): Promise<Plan | null> => {
  return planRepository.findPlanByIdRepository(id);
};

export const updatePlan = async (id: number, data: UpdatePlanDTO): Promise<Plan | null> => {
  const existing = await planRepository.findPlanByIdRepository(id);
  if (!existing) return null;
  return planRepository.updatePlanRepository(id, data);
};

export const deletePlan = async (id: number): Promise<boolean> => {
  const existing = await planRepository.findPlanByIdRepository(id);
  if (!existing) return false;
  return planRepository.deletePlanRepository(id);
};
