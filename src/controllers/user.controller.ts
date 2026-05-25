import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400); // Set status for errorHandler or handle cleanly
    next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = await userService.loginUser(req.body);
    res.status(200).json(credentials);
  } catch (error: any) {
    res.status(401);
    next(error);
  }
};
