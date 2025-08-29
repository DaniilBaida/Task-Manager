import { Task } from "@/data/Entities/Task";
import { repository } from "@/data/repositories";
import { mailer } from "@/services/mailer";
import { CreateTaskUseCase } from "@/use-cases/CreateTaskUseCase";
import {
    encodeBase64,
    getPaginationParameters,
    parseTaskQueryParameters,
} from "@/utils";
import { Request, Response } from "express";

export const getAllTasks = async (req: Request, res: Response) => {
    const { limit, nextCursor, prevCursor } = getPaginationParameters(req);
    const queryParameters = parseTaskQueryParameters(req);

    const result = await repository.getAllTasks(
        { limit, nextCursor, prevCursor, ...queryParameters },
        req.auth!.payload.sub!
    );

    const tasks = result.tasks.map((task) => Task.mapTask(task));

    res.status(200).json({
        tasks: tasks.map((task) => task.asDto()),
        nextCursor: result.nextCursor
            ? encodeBase64(result.nextCursor.toISOString())
            : null,
        prevCursor: result.prevCursor
            ? encodeBase64(result.prevCursor.toISOString())
            : null,
    });
};

export const getTask = async (req: Request, res: Response) => {
    const taskData = await repository.getTask(
        req.params.id,
        req.auth!.payload.sub!
    );

    const task = Task.mapTask(taskData);

    res.status(200).json({ task: task.asDto() });
};

export const markTaskAsCompleted = async (req: Request, res: Response) => {
    const userId = req.auth!.payload.sub!;

    const taskData = await repository.getTask(req.params.id, userId);

    const task = Task.mapTask(taskData);

    task.markAsCompleted();

    await repository.updateTask(req.params.id, task, userId);

    res.status(200).json({ task: task.asDto() });
};

export const createTask = async (req: Request, res: Response) => {
    const createTaskUseCase = new CreateTaskUseCase(req, mailer);
    const task = await createTaskUseCase.execute();

    res.status(201).json({ task: task.asDto() });
};

export const updateTask = async (req: Request, res: Response) => {
    const taskData = await repository.updateTask(
        req.params.id,
        req.body,
        req.auth!.payload.sub!
    );

    const task = Task.mapTask(taskData);

    res.status(200).json({ task: task.asDto() });
};
