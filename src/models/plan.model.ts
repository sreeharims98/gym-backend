import { Plan as PrismaPlan } from "../generated/prisma";

export type Plan = PrismaPlan;

export interface CreatePlanDTO {
  name: string;
  duration_months: number;
  price: number;
}

export interface UpdatePlanDTO {
  name?: string;
  duration_months?: number;
  price?: number;
}
