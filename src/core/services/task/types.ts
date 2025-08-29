import { Task } from "@/core/domain/entities/Task";
import {
    ITaskCreatePayload,
    ITaskQueryParameters,
    ITaskUpdatePayload,
} from "@/infrastructure/database/repositories/types";

export interface ITaskService {
    getAllTasks(
        limit: number | undefined,
        nextCursor: string | undefined,
        prevCursor: string | undefined,
        queryParameters: ITaskQueryParameters,
        userId: string
    ): Promise<{
        tasks: Task[];
        nextCursor: string | null;
        prevCursor: string | null;
    }>;

    getTask(id: string, userId: string): Promise<Task>;
    markTaskAsCompleted(id: string, userId: string): Promise<Task>;
    createTask(payload: ITaskCreatePayload, userId: string): Promise<Task>;
    updateTask(
        id: string,
        payload: ITaskUpdatePayload,
        userId: string
    ): Promise<Task>;
}
