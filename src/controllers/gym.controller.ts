import { Request, Response, NextFunction } from "express";
import * as gymService from "../services/gym.service";

export const createGymController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const gym = await gymService.createGym(req.body);
    res.status(201).json(gym);
  } catch (error) {
    next(error);
  }
};

export const getAllGymsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const gyms = await gymService.getAllGyms();
    res.status(200).json(gyms);
  } catch (error) {
    next(error);
  }
};

export const getGymByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const gym = await gymService.getGymById(id);
    if (!gym) {
      return res.status(404).json({ message: "Gym branch not found" });
    }
    res.status(200).json(gym);
  } catch (error) {
    next(error);
  }
};

export const updateGymController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const gym = await gymService.updateGym(id, req.body);
    if (!gym) {
      return res.status(404).json({ message: "Gym branch not found" });
    }
    res.status(200).json(gym);
  } catch (error) {
    next(error);
  }
};

export const deleteGymController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await gymService.deleteGym(id);
    if (!success) {
      return res.status(404).json({ message: "Gym branch not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
