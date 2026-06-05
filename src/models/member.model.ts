import { Member as PrismaMember } from "../generated/prisma";

export type Member = PrismaMember;

export interface RegisterMemberDTO {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  join_date: string | Date;
  emergency_contact: string;
  photo_url?: string | null;
  height?: number | null;
  weight?: number | null;
  gym_id: number;
  registration_fee?: number;
}

export interface AssignPlanDTO {
  plan_id: number;
  start_date?: string | Date;
}

export interface UpdateMemberDTO {
  name?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  join_date?: string | Date;
  emergency_contact?: string;
  photo_url?: string | null;
  height?: number | null;
  weight?: number | null;
  status?: string;
  gym_id?: number;
  plan_id?: number;
}
