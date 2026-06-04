import { Gym as PrismaGym } from "../generated/prisma";

export type Gym = PrismaGym;

export interface CreateGymDTO {
  name: string;
  location: string;
  contact_no: string;
  registration_fee?: number;
}

export interface UpdateGymDTO {
  name?: string;
  location?: string;
  contact_no?: string;
  registration_fee?: number;
}
