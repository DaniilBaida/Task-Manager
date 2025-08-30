import {
    IProjectCreatePayload,
    IProjectQueryParameters,
    IProjectUpdatePayload,
} from "@/infrastructure/database/repositories/types";
import { IProjectService } from "./types";

import { repository } from "@/infrastructure/database/repositories";
import { encodeCursor } from "@/shared/utils";
import { Project } from "@/core/domain/entities/Project";

export class ProjectService implements IProjectService {
    async getAllProjects(
        limit: number | undefined,
        nextCursor: string | undefined,
        prevCursor: string | undefined,
        queryParameters: IProjectQueryParameters,
        userId: string
    ): Promise<{
        projects: Project[];
        nextCursor: string | null;
        prevCursor: string | null;
    }> {
        const result = await repository.getAllProjects(
            { limit, nextCursor, prevCursor, ...queryParameters },
            userId
        );

        const projects = result.projects.map((project) =>
            Project.mapProject(project)
        );

        return {
            projects,
            nextCursor: encodeCursor(result.nextCursor),
            prevCursor: encodeCursor(result.prevCursor),
        };
    }
    async getProject(id: string, userId: string): Promise<Project> {
        const projectData = await repository.getProject(id, userId);

        const project = Project.mapProject(projectData);

        return project;
    }
    async createProject(
        payload: IProjectCreatePayload,
        userId: string
    ): Promise<Project> {
        const projectData = await repository.createProject(payload, userId);

        const project = Project.mapProject(projectData);

        return project;
    }
    async updateProject(
        id: string,
        payload: IProjectUpdatePayload,
        userId: string
    ): Promise<Project> {
        const projectData = await repository.updateProject(id, payload, userId);

        const project = Project.mapProject(projectData);

        return project;
    }
}
