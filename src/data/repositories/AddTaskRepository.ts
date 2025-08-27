import { Prisma } from "@prisma/client";
import BaseRepository, { Constructor } from "./BaseRepository";
import {
    ITask,
    ITaskCreatePayload,
    ITaskQueryParameters,
    ITaskRepository,
    ITaskUpdatePayload,
} from "./repository";
import EntityNotFoundError from "@/errors/EntityNotFoundError";

type PrismaTask = Prisma.TaskGetPayload<{}>;

export function AddTaskRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class TaskRepositoryMixin extends Base implements ITaskRepository {
        mapTask(task: PrismaTask): ITask {
            return {
                id: task.id,
                user_id: task.user_id,
                project_id: task.project_id,
                name: task.name,
                description: task.description,
                due_date: task.due_date,
                completed_on: task.completed_on,
                created_at: task.created_at,
            };
        }
        async getAllTasks(
            query: ITaskQueryParameters,
            userId: string
        ): Promise<ITask[]> {
            const tasks = await this.client.task.findMany({
                where: {
                    user_id: userId,
                    project_id: query.projectId,
                },
                take: query.limit || this.defaultLimit,
                skip: query.offset || this.defaultOffset,
            });
            return tasks.map((task) => this.mapTask(task));
        }

        async getTask(id: string, userId: string): Promise<ITask> {
            const task = await this.client.task.findUnique({
                where: {
                    id,
                    user_id: userId,
                },
            });
            if (!task) {
                throw new EntityNotFoundError({
                    message: "Task not found",
                    statusCode: 404,
                    code: "ERR_NF",
                });
            }
            return this.mapTask(task);
        }
        async createTask(
            payload: ITaskCreatePayload,
            userId: string
        ): Promise<ITask> {
            const task = await this.client.task.create({
                data: {
                    user_id: userId,
                    ...payload,
                },
            });
            return this.mapTask(task);
        }

        async updateTask(
            id: string,
            payload: ITaskUpdatePayload,
            userId: string
        ): Promise<ITask> {
            const task = await this.client.task.update({
                where: {
                    id,
                    user_id: userId,
                },
                data: { ...payload },
            });
            return this.mapTask(task);
        }
    };
}
