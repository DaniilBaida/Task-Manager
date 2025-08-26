import { Router } from "express";
import {
    createProject,
    getAllProjects,
    getAllProjectTasks,
    getProject,
    updateProject,
} from "@/routes/v1/projects/controller";
import authenticateUser from "@/middleware/authenticate-user";
import validateRequest from "@/middleware/validate-request";
import {
    createProjectSchema,
    updateProjectSchema,
} from "@/data/request-schemas";

const projects: Router = Router();

projects.use(authenticateUser);

projects.get("/", getAllProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", getAllProjectTasks);
projects.post("/", validateRequest(createProjectSchema), createProject);
projects.put("/:id", validateRequest(updateProjectSchema), updateProject);

export default projects;
