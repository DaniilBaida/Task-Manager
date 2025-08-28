import { repository } from "@/data/repositories";
import { getPaginationParameters } from "@/utils";
import { Request, Response } from "express";

export const getAllProjects = async (req: Request, res: Response) => {
    const { page, perPage, limit, offset } = getPaginationParameters(req);
    const result = await repository.getAllProjects(
        { limit, offset },
        req.auth!.payload.sub!
    );
    res.status(200).json({
        projects: result.projects,
        page,
        per_page: perPage,
        total_pages: Math.ceil(result.totalCount / perPage),
        total_count: result.totalCount,
    });
};

export const getProject = async (req: Request, res: Response) => {
    const project = await repository.getProject(
        req.params.id,
        req.auth!.payload.sub!
    );
    res.status(200).json({ project });
};

export const getAllProjectTasks = async (req: Request, res: Response) => {
    const { page, perPage, limit, offset } = getPaginationParameters(req);
    const result = await repository.getAllTasks(
        { projectId: req.params.id, limit, offset },
        req.auth!.payload.sub!
    );

    res.status(200).json({
        tasks: result.tasks,
        page,
        perPage,
        total_pages: Math.ceil(result.totalCount / perPage),
        total_count: result.totalCount,
    });
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
