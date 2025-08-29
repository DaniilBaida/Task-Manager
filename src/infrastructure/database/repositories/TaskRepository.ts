import { Prisma } from "@prisma/client";
import BaseRepository, { Constructor } from "./BaseRepository";
import {
    ITask,
    ITaskCreatePayload,
    ITaskQueryParameters,
    ITaskQueryResult,
    ITaskRepository,
    ITaskUpdatePayload,
} from "./types";
import EntityNotFoundError from "@/shared/errors/EntityNotFoundError";
import TaskError from "@/shared/errors/TaskError";

type PrismaTask = Prisma.TaskGetPayload<{}>;

export function TaskRepository<TBase extends Constructor<BaseRepository>>(
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
        ): Promise<ITaskQueryResult> {
            const { limit, sortOrder, operator, cursor } =
                this.getPaginationQueryParameters(query);

            const where: Prisma.TaskWhereInput = {
                user_id: userId,
                project_id: query.projectId,
                created_at: { [operator]: cursor },
                name: { contains: query.search, mode: "insensitive" },
            };

            if (query.completed !== undefined) {
                where.completed_on = query.completed ? { not: null } : null;
            }

            const tasks = await this.client.task.findMany({
                where,
                take: limit + 1,
                orderBy: query.orderBy as Prisma.TaskOrderByWithRelationInput,
            });

            const { nextCursorTimestamp, prevCursorTimestamp } =
                this.getPaginationCursors(query, tasks, limit, sortOrder);

            if (sortOrder === "desc") tasks.reverse();

            return {
                tasks: tasks.map((task) => this.mapTask(task)),
                nextCursor: nextCursorTimestamp,
                prevCursor: prevCursorTimestamp,
            };
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
                    message: `Task with ID '${id}' not found`,
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
            const existingTask = await this.client.task.findUnique({
                where: {
                    id,
                    user_id: userId,
                },
            });

            if (!existingTask) {
                throw new EntityNotFoundError({
                    message: `Task with ID '${id}' not found`,
                    statusCode: 404,
                    code: "ERR_NF",
                });
            }

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
