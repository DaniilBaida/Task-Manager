import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    markTaskAsCompleted,
} from "@/infrastructure/web/controllers/v1/TaskController";
import authenticateUser from "@/infrastructure/web/middleware/authenticate-user";
import validateRequest from "@/infrastructure/web/middleware/validate-request";
import {
    createTaskSchema,
    updateTaskSchema,
} from "@/core/domain/types/request-schemas";

const tasks: Router = Router();

tasks.use(authenticateUser);

tasks.get("/", getAllTasks);
tasks.get("/:id", getTask);
tasks.post("/", validateRequest(createTaskSchema), createTask);
tasks.put("/:id", validateRequest(updateTaskSchema), updateTask);
tasks.patch("/:id/complete", markTaskAsCompleted);

export default tasks;
