import { repository } from "@/data/repositories";
import { encodeBase64, getPaginationParameters } from "@/utils";
import { Request, Response } from "express";

export const getAllProjects = async (req: Request, res: Response) => {
    const { limit, nextCursor, prevCursor } = getPaginationParameters(req);
    const result = await repository.getAllProjects(
        { limit, nextCursor, prevCursor },
        req.auth!.payload.sub!
    );
    res.status(200).json({
        projects: result.projects,
        nextCursor: result.nextCursor
            ? encodeBase64(result.nextCursor.toISOString())
            : null,
        prevCursor: result.prevCursor
            ? encodeBase64(result.prevCursor.toISOString())
            : null,
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
    const { limit, nextCursor, prevCursor } = getPaginationParameters(req);
    const result = await repository.getAllTasks(
        { projectId: req.params.id, limit, nextCursor, prevCursor },
        req.auth!.payload.sub!
    );

    res.status(200).json({
        tasks: result.tasks,
        nextCursor: result.nextCursor
            ? encodeBase64(result.nextCursor.toISOString())
            : null,
        prevCursor: result.prevCursor
            ? encodeBase64(result.prevCursor.toISOString())
            : null,
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
