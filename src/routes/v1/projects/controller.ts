import { Request, Response } from "express";
import prisma from "@/prisma-client";
import EntityNotFoundError from "@/errors/EntityNotFoundError";

export const getAllProjects = async (req: Request, res: Response) => {
    const projects = await prisma.project.findMany({
        where: { user_id: req.auth?.payload.sub },
    });

    res.status(200).json({ projects });
};

export const getProject = async (req: Request, res: Response) => {
    const project = await prisma.project.findUnique({
        where: {
            id: req.params.id,
            user_id: req.auth?.payload.sub,
        },
    });

    if (!project) {
        throw new EntityNotFoundError({
            message: "Project not found",
            statusCode: 404,
            code: "ERR_NF",
        });
    }
    res.status(200).json({ project });
};

export const getAllProjectTasks = async (req: Request, res: Response) => {
    const project = await prisma.project.findUnique({
        where: {
            id: req.params.id,
            user_id: req.auth?.payload.sub,
        },
        include: {
            tasks: true,
        },
    });

    if (!project) {
        throw new EntityNotFoundError({
            message: "Project not found",
            statusCode: 404,
            code: "ERR_NF",
        });
    }

    res.status(200).json({ tasks: project.tasks });
};

export const createProject = async (req: Request, res: Response) => {
    const project = await prisma.project.create({
        data: {
            user_id: req.auth?.payload.sub as string,
            ...req.body,
        },
    });
    res.status(201).json({ project });
};

export const updateProject = async (req: Request, res: Response) => {
    const project = await prisma.project.update({
        where: {
            id: req.params.id,
            user_id: req.auth?.payload.sub,
        },
        data: { ...req.body },
    });

    res.status(200).json({ project });
};
