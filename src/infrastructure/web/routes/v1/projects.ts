import { Router } from "express";
import {
    createProject,
    getAllProjects,
    getAllProjectTasks,
    getProject,
    updateProject,
} from "@/infrastructure/web/controllers/v1/ProjectController";
import authenticateUser from "@/infrastructure/web/middleware/authenticate-user";
import validateRequest from "@/infrastructure/web/middleware/validate-request";
import {
    createProjectSchema,
    updateProjectSchema,
} from "@/core/domain/types/request-schemas";

const projects: Router = Router();

projects.use(authenticateUser);

projects.get("/", getAllProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", getAllProjectTasks);
projects.post("/", validateRequest(createProjectSchema), createProject);
projects.put("/:id", validateRequest(updateProjectSchema), updateProject);

export default projects;
