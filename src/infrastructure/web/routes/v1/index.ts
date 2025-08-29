import { Router } from "express";
import tasks from "@/infrastructure/web/routes/v1/tasks";
import projects from "@/infrastructure/web/routes/v1/projects";

const v1: Router = Router();

v1.use("/tasks", tasks);
v1.use("/projects", projects);

export default v1;
