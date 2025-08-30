import { projectService } from "@/core/services/projects";
import { taskService } from "@/core/services/task";
import { repository } from "@/infrastructure/database/repositories";
import {
    getPaginationParameters,
    parseProjectQueryParameters,
} from "@/shared/utils";
import { Request, Response } from "express";

export const getAllProjects = async (req: Request, res: Response) => {
    const { limit, nextCursor, prevCursor } = getPaginationParameters(req);
    const queryParameters = parseProjectQueryParameters(req);

    const result = await projectService.getAllProjects(
        limit,
        nextCursor,
        prevCursor,
        queryParameters,
        req.auth!.payload.sub!
    );

    res.status(200).json({
        projects: result.projects,
        nextCursor: result.nextCursor,
        prevCursor: result.prevCursor,
    });
};

export const getProject = async (req: Request, res: Response) => {
    const project = await projectService.getProject(
        req.params.id,
        req.auth!.payload.sub!
    );
    res.status(200).json({ project });
};

export const getAllProjectTasks = async (req: Request, res: Response) => {
    const { limit, nextCursor, prevCursor } = getPaginationParameters(req);
    const result = await taskService.getAllTasks(
        limit,
        nextCursor,
        prevCursor,
        { projectId: req.params.id },
        req.auth!.payload.sub!
    );

    res.status(200).json({
        tasks: result.tasks,
        nextCursor: result.nextCursor,
        prevCursor: result.prevCursor,
    });
};

export const createProject = async (req: Request, res: Response) => {
    const project = await projectService.createProject(
        req.body,
        req.auth!.payload.sub!
    );
    res.status(201).json({ project });
};

export const updateProject = async (req: Request, res: Response) => {
    const project = await projectService.updateProject(
        req.params.id,
        req.body,
        req.auth!.payload.sub!
    );

    res.status(200).json({ project });
};
