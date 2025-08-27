import { repository } from "@/data/repositories";
import { Request, Response } from "express";

export const getAllProjects = async (req: Request, res: Response) => {
    const projects = await repository.getAllProjects(
        {},
        req.auth!.payload.sub!
    );
    res.status(200).json({ projects });
};

export const getProject = async (req: Request, res: Response) => {
    const project = await repository.getProject(
        req.params.id,
        req.auth!.payload.sub!
    );
    res.status(200).json({ project });
};

export const getAllProjectTasks = async (req: Request, res: Response) => {
    const tasks = await repository.getAllTasks(
        { projectId: req.params.id },
        req.auth!.payload.sub!
    );

    res.status(200).json({ tasks });
};

export const createProject = async (req: Request, res: Response) => {
    const project = await repository.createProject(
        req.body,
        req.params.id,
        req.auth!.payload.sub!
    );
    res.status(201).json({ project });
};

export const updateProject = async (req: Request, res: Response) => {
    const project = await repository.updateProject(
        req.params.id,
        req.body,
        req.auth!.payload.sub!
    );

    res.status(200).json({ project });
};
