import { Prisma } from "@prisma/client";
import BaseRepository, { Constructor } from "./BaseRepository";
import {
    IProject,
    IProjectCreatePayload,
    IProjectQueryParameters,
    IProjectQueryResult,
    IProjectRepository,
    IProjectUpdatePayload,
} from "./types";
import EntityNotFoundError from "@/shared/errors/EntityNotFoundError";

type PrismaProject = Prisma.ProjectGetPayload<{}>;

export function ProjectRepository<TBase extends Constructor<BaseRepository>>(
    Base: TBase
) {
    return class ProjectRepositoryMixin
        extends Base
        implements IProjectRepository
    {
        mapProject(project: PrismaProject): IProject {
            return {
                id: project.id,
                user_id: project.user_id,
                name: project.name,
                description: project.description,
                created_at: project.created_at,
            };
        }
        async getAllProjects(
            query: IProjectQueryParameters,
            userId: string
        ): Promise<IProjectQueryResult> {
            const { limit, sortOrder, operator, cursor } =
                this.getPaginationQueryParameters(query);

            const where: Prisma.ProjectWhereInput = {
                user_id: userId,
                created_at: { [operator]: cursor },
                name: { contains: query.search, mode: "insensitive" },
            };

            const projects = await this.client.project.findMany({
                where,
                take: limit + 1,
                orderBy:
                    query.orderBy as Prisma.ProjectOrderByWithRelationInput,
            });

            const { nextCursorTimestamp, prevCursorTimestamp } =
                this.getPaginationCursors(query, projects, limit, sortOrder);

            if (sortOrder === "desc") projects.reverse();

            return {
                projects: projects.map((project) => this.mapProject(project)),
                nextCursor: nextCursorTimestamp,
                prevCursor: prevCursorTimestamp,
            };
        }
        async getProject(id: string, userId: string): Promise<IProject> {
            const project = await this.client.project.findUnique({
                where: { id, user_id: userId },
            });

            if (!project) {
                throw new EntityNotFoundError("Project", id);
            }
            return this.mapProject(project);
        }
        async createProject(
            payload: IProjectCreatePayload,
            userId: string
        ): Promise<IProject> {
            const project = await this.client.project.create({
                data: { user_id: userId, ...payload },
            });

            return this.mapProject(project);
        }

        async updateProject(
            id: string,
            payload: IProjectUpdatePayload,
            userId: string
        ): Promise<IProject> {
            const existingProject = await this.client.project.findUnique({
                where: { id, user_id: userId },
            });

            if (!existingProject) {
                throw new EntityNotFoundError("Project", id);
            }

            const project = await this.client.project.update({
                where: { id, user_id: userId },
                data: { ...payload },
            });

            return this.mapProject(project);
        }
    };
}
