import { AddProjectRepository } from "./AddProjectRepository";
import { AddTaskRepository } from "./AddTaskRepository";
import BaseRepository from "./BaseRepository";

export const repository = new (AddProjectRepository(
    AddTaskRepository(BaseRepository)
))();
