import { NextFunction, Request, Response } from "express";
import prisma from "../../../prisma-client";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";

export const getAllTasks = async (req: Request, res: Response) => {
    const tasks = await prisma.task.findMany();
    res.status(200).json({ tasks });
};

export const getTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const task = await prisma.task.findUnique({
        where: {
            id: req.params.id,
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
