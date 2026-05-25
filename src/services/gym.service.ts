import * as gymRepository from '../repositories/gym.repository';
import { Gym, CreateGymDTO, UpdateGymDTO } from '../models/gym.model';

export const createGym = async (data: CreateGymDTO): Promise<Gym> => {
  return gymRepository.createGymRepository(data);
};

export const getAllGyms = async (): Promise<Gym[]> => {
  return gymRepository.findAllGymsRepository();
};

export const getGymById = async (id: number): Promise<Gym | null> => {
  return gymRepository.findGymByIdRepository(id);
};

export const updateGym = async (id: number, data: UpdateGymDTO): Promise<Gym | null> => {
  const existing = await gymRepository.findGymByIdRepository(id);
  if (!existing) return null;
  return gymRepository.updateGymRepository(id, data);
};

export const deleteGym = async (id: number): Promise<boolean> => {
  const existing = await gymRepository.findGymByIdRepository(id);
  if (!existing) return false;
  return gymRepository.deleteGymRepository(id);
};
