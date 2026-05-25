import { User as PrismaUser } from "../generated/prisma";

export type User = PrismaUser;

export interface RegisterUserDTO {
  email: string;
  password?: string; // Optional during raw DTO, but validated strictly
  role: "owner" | "staff";
  gym_id?: number | null;
}

export interface LoginUserDTO {
  email: string;
  password?: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  role: string;
  gym_id?: number | null;
  created_at: Date;
}
