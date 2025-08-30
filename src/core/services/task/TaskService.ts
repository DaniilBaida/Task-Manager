import { Task } from "@/core/domain/entities/Task";
import { repository } from "@/infrastructure/database/repositories";
import {
    ITask,
    ITaskCreatePayload,
    ITaskQueryParameters,
    ITaskUpdatePayload,
} from "@/infrastructure/database/repositories/types";
import { encodeBase64, encodeCursor } from "@/shared/utils";
import { ITaskService } from "./types";

export class TaskService implements ITaskService {
    async getAllTasks(
        limit: number | undefined,
        nextCursor: string | undefined,
        prevCursor: string | undefined,
        queryParameters: ITaskQueryParameters,
        userId: string
    ) {
        const result = await repository.getAllTasks(
            { limit, nextCursor, prevCursor, ...queryParameters },
            userId
        );

        return {
            tasks: result.tasks.map((task: ITask) => Task.mapTask(task)),
            nextCursor: encodeCursor(result.nextCursor),
            prevCursor: encodeCursor(result.prevCursor),
        };
    }

    async getTask(id: string, userId: string): Promise<Task> {
        const taskData = await repository.getTask(id, userId);

        const task = Task.mapTask(taskData);

        return task;
    }

    async markTaskAsCompleted(id: string, userId: string): Promise<Task> {
        const taskData = await repository.getTask(id, userId);

        const task = Task.mapTask(taskData);

        task.markAsCompleted();

        await repository.updateTask(id, task, userId);

        return task;
    }

    async createTask(
        payload: ITaskCreatePayload,
        userId: string
    ): Promise<Task> {
        const taskData = await repository.createTask(payload, userId);

        const task = Task.mapTask(taskData);

        return task;
    }

    async updateTask(
        id: string,
        payload: ITaskUpdatePayload,
        userId: string
    ): Promise<Task> {
        const taskData = await repository.updateTask(id, payload, userId);

        const task = Task.mapTask(taskData);

        return task;
    }
}
