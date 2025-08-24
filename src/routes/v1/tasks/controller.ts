import { NextFunction, Request, Response } from "express";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";

export const getAllTasks = (req: Request, res: Response) => {
    res.status(200).json({});
};

export const getTask = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ id: 1, name: "Task 1" });
};
