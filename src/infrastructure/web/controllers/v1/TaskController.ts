import { Task } from "@/core/domain/entities/Task";
import { mailer } from "@/core/services/notification";
import { taskService } from "@/core/services/task";

import { CreateTaskUseCase } from "@/core/use-cases/task/CreateTaskUseCase";
import {
    getPaginationParameters,
    parseTaskQueryParameters,
} from "@/shared/utils";
import { Request, Response } from "express";

export const getAllTasks = async (req: Request, res: Response) => {
    const { limit, nextCursor, prevCursor } = getPaginationParameters(req);
    const queryParameters = parseTaskQueryParameters(req);

    const result = await taskService.getAllTasks(
        limit,
        nextCursor,
        prevCursor,
        queryParameters,
        req.auth!.payload.sub!
    );

    res.status(200).json({
        tasks: result.tasks.map((task: Task) => task.asDto()),
        nextCursor: result.nextCursor,
        prevCursor: result.prevCursor,
    });
};

export const getTask = async (req: Request, res: Response) => {
    const task = await taskService.getTask(
        req.params.id,
        req.auth!.payload.sub!
    );

    res.status(200).json({ task: task.asDto() });
};

export const markTaskAsCompleted = async (req: Request, res: Response) => {
    const task = await taskService.markTaskAsCompleted(
        req.params.id,
        req.auth!.payload.sub!
    );

    res.status(200).json({ task: task.asDto() });
};

export const createTask = async (req: Request, res: Response) => {
    const createTaskUseCase = new CreateTaskUseCase(mailer);
    const task = await createTaskUseCase.execute(
        req.body,
        req.auth!.payload.sub!
    );

    res.status(201).json({ task: task.asDto() });
};

export const updateTask = async (req: Request, res: Response) => {
    const task = await taskService.updateTask(
        req.params.id,
        req.body,
        req.auth!.payload.sub!
    );

    res.status(200).json({ task: task.asDto() });
};
