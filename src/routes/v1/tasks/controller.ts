import { NextFunction, Request, Response } from "express";
import prisma from "../../../prisma-client";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";

export const getAllTasks = async (req: Request, res: Response) => {
    const tasks = await prisma.task.findMany({
        where: {
            user_id: req.auth?.payload.sub,
        },
    });
    res.status(200).json({ tasks });
};

export const getTask = async (req: Request, res: Response) => {
    const task = await prisma.task.findUnique({
        where: {
            id: req.params.id,
            user_id: req.auth?.payload.sub,
        },
    });

    if (!task) {
        throw new EntityNotFoundError({
            message: "Task not found",
            statusCode: 404,
            code: "ERR_NF",
        });
    }
    res.status(200).json({ task });
};

export const createTask = async (req: Request, res: Response) => {
    const task = await prisma.task.create({
        data: {
            user_id: req.auth?.payload.sub as string,
            ...req.body,
        },
    });

    res.status(201).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
    const task = await prisma.task.update({
        where: {
            id: req.params.id,
            user_id: req.auth?.payload.sub,
        },
        data: { ...req.body },
    });
    res.status(200).json({ task });
};
