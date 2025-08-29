export interface ITask {
    id: string;
    user_id: string;
    project_id: string | null;
    name: string;
    description: string | null;
    due_date: Date | null;
    completed_on: Date | null;
    created_at: Date;
}
export interface ITaskCreatePayload {
    project_id: string | null;
    name: string;
    description: string | null;
    due_date: Date | null;
    completed_on: Date | null;
}
export type ITaskUpdatePayload = Partial<ITaskCreatePayload>;

export interface IProject {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    created_at: Date;
}

export interface IProjectCreatePayload {
    name: string;
    description: string | null;
    created_at: Date;
}

export type IProjectUpdatePayload = Partial<IProjectCreatePayload>;

export interface IQueryParameters {
    limit?: number;
    nextCursor?: string;
    prevCursor?: string;
}

export interface ITaskQueryParameters extends IQueryParameters {
    projectId?: string;
    search?: string;
    completed?: boolean;
    orderBy?: { [key in "created_at" | "due_date"]?: "asc" | "desc" };
}

export interface IProjectQueryParameters extends IQueryParameters {
    search?: string;
    orderBy?: { created_at: "asc" | "desc" };
}

export interface ITaskQueryResult {
    tasks: ITask[];
    nextCursor: Date | null;
    prevCursor: Date | null;
}

export interface IProjectQueryResult {
    projects: IProject[];
    nextCursor: Date | null;
    prevCursor: Date | null;
}

export interface ITaskRepository {
    getAllTasks(
        query: ITaskQueryParameters,
        userId: string
    ): Promise<ITaskQueryResult>;
    getTask(id: string, userId: string): Promise<ITask>;
    createTask(payload: ITaskCreatePayload, userId: string): Promise<ITask>;
    updateTask(
        id: string,
        payload: ITaskUpdatePayload,
        userId: string
    ): Promise<ITask>;
}

export interface IProjectRepository {
    getAllProjects(
        query: IProjectQueryParameters,
        userId: string
    ): Promise<IProjectQueryResult>;
    getProject(id: string, userId: string): Promise<IProject>;
    createProject(
        payload: IProjectCreatePayload,
        id: string,
        userId: string
    ): Promise<IProject>;
    updateProject(
        id: string,
        payload: IProjectUpdatePayload,
        userId: string
    ): Promise<IProject>;
}
