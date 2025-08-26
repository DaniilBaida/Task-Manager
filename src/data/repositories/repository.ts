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

interface IQueryParameters {
    limit?: number;
    offset?: number;
}

export interface ITaskQueryParameters extends IQueryParameters {
    projectId?: string;
}

export interface IProjectQueryParameters extends IQueryParameters {}

export interface ITaskRepository {
    getAllTasks(query: ITaskQueryParameters, userId: string): Promise<ITask[]>;
    getTask(id: string, userId: string): Promise<ITask>;
    createTask(payload: Partial<ITask>, userId: string): Promise<ITask>;
    updateTask(
        id: string,
        payload: Partial<ITask>,
        userId: string
    ): Promise<ITask>;
}

export interface IProjectRepository {
    getAllProjects(
        query: IProjectQueryParameters,
        userId: string
    ): Promise<IProject[]>;
    getProject(id: string, userId: string): Promise<IProject>;
    getAllProjectTasks(id: string, userId: string): Promise<ITask>;
    createProject(
        payload: Partial<IProject>,
        id: string,
        userId: string
    ): Promise<IProject>;
    updateProject(
        id: string,
        payload: Partial<IProject>,
        userId: string
    ): Promise<IProject>;
}
