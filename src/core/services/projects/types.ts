import { Project } from "@/core/domain/entities/Project";
import { Task } from "@/core/domain/entities/Task";
import {
    IProjectCreatePayload,
    IProjectQueryParameters,
    IProjectUpdatePayload,
} from "@/infrastructure/database/repositories/types";

export interface IProjectService {
    getAllProjects(
        limit: number | undefined,
        nextCursor: string | undefined,
        prevCursor: string | undefined,
        queryParameters: IProjectQueryParameters,
        userId: string
    ): Promise<{
        projects: Project[];
        nextCursor: string | null;
        prevCursor: string | null;
    }>;
    getProject(id: string, userId: string): Promise<Project>;
    createProject(
        payload: IProjectCreatePayload,
        userId: string
    ): Promise<Project>;
    updateProject(
        id: string,
        payload: IProjectUpdatePayload,
        userId: string
    ): Promise<Project>;
}
