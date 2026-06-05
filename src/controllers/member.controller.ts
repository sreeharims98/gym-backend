import { Request, Response, NextFunction } from "express";
import * as memberService from "../services/member.service";

export const registerMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const member = await memberService.registerMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

export const getAllMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, phone, gym_id, status } = req.query;

    const filters = {
      search: search ? String(search) : undefined,
      phone: phone ? String(phone) : undefined,
      gym_id: gym_id ? parseInt(String(gym_id), 10) : undefined,
      status: status ? String(status) : undefined,
    };

    const members = await memberService.getAllMembers(filters);
    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

export const getMemberByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await memberService.getMemberById(id);
    if (!member) {
      return res.status(404).json({ message: "Gym member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    next(error);
  }
};

export const updateMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await memberService.updateMember(id, req.body);
    if (!member) {
      return res.status(404).json({ message: "Gym member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    next(error);
  }
};

export const deleteMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await memberService.deleteMember(id);
    if (!success) {
      return res.status(404).json({ message: "Gym member not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const assignPlanController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await memberService.assignPlanToMember(id, req.body);
    res.status(200).json(member);
  } catch (error) {
    next(error);
  }
};
