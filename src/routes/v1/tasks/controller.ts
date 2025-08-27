import { repository } from "@/data/repositories";
import { Request, Response } from "express";

export const getAllTasks = async (req: Request, res: Response) => {
    const tasks = await repository.getAllTasks({}, req.auth!.payload.sub!);
    res.status(200).json({ tasks });
};

export const getTask = async (req: Request, res: Response) => {
    const task = await repository.getTask(
        req.params.id,
        req.auth!.payload.sub!
    );
    res.status(200).json({ task });
};

export const createTask = async (req: Request, res: Response) => {
    const task = await repository.createTask(req.body, req.auth!.payload.sub!);
    res.status(201).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
    const task = await repository.updateTask(
        req.params.id,
        req.body,
        req.auth!.payload.sub!
    );
    res.status(200).json({ task });
};
