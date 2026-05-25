import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user.repository";
import {
  RegisterUserDTO,
  LoginUserDTO,
  UserResponseDTO,
} from "../models/user.model";
import { hashPassword, verifyPassword } from "../utils/crypto";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/errors";

export const registerUser = async (
  data: RegisterUserDTO,
): Promise<UserResponseDTO> => {
  if (!data.password) {
    throw new AppError("Password is required", 400);
  }

  const existingUser = await findUserByEmailRepository(data.email);
  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  const password_hash = hashPassword(data.password);

  const user = await createUserRepository({
    email: data.email,
    role: data.role,
    gym_id: data.gym_id,
    password_hash,
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    gym_id: user.gym_id,
    created_at: user.created_at,
  };
};

export const loginUser = async (
  data: LoginUserDTO,
): Promise<{ user: UserResponseDTO; token: string }> => {
  if (!data.password) {
    throw new AppError("Password is required", 400);
  }

  const user = await findUserByEmailRepository(data.email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = verifyPassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const userResponse: UserResponseDTO = {
    id: user.id,
    email: user.email,
    role: user.role,
    gym_id: user.gym_id,
    created_at: user.created_at,
  };

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role as "owner" | "staff",
    gym_id: user.gym_id,
  });

  return {
    user: userResponse,
    token,
  };
};
