import { Router } from "express";
import { getAllProjects, getAllProjectTasks, getProject } from "./controller";

const projects: Router = Router();

projects.get("/", getAllProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", getAllProjectTasks);

export default projects;
