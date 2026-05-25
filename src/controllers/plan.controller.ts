import { Request, Response, NextFunction } from "express";
import * as planService from "../services/plan.service";

export const createPlanController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plan = await planService.createPlan(req.body);
    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
};

export const getAllPlansController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plans = await planService.getAllPlans();
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};

export const getPlanByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const plan = await planService.getPlanById(id);
    if (!plan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

export const updatePlanController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const plan = await planService.updatePlan(id, req.body);
    if (!plan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

export const deletePlanController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await planService.deletePlan(id);
    if (!success) {
      return res.status(404).json({ message: "Membership plan not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
