import { Router } from "express";
import { getAllProjects, getAllProjectTasks, getProject } from "./controller";
import authenticateUser from "../../../middleware/authenticate-user";

const projects: Router = Router();

projects.use(authenticateUser);

projects.get("/", getAllProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", getAllProjectTasks);

export default projects;
