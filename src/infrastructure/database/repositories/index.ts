import { ProjectRepository } from "./ProjectRepository";
import { TaskRepository } from "./TaskRepository";
import BaseRepository from "./BaseRepository";

export const repository = new (ProjectRepository(
    TaskRepository(BaseRepository)
))();
