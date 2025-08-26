import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
} from "@/routes/v1/tasks/controller";
import authenticateUser from "@/middleware/authenticate-user";
import validateRequest from "@/middleware/validate-request";
import { createTaskSchema, updateTaskSchema } from "@/data/request-schemas";

const tasks: Router = Router();

tasks.use(authenticateUser);

tasks.get("/", getAllTasks);
tasks.get("/:id", getTask);
tasks.post("/", validateRequest(createTaskSchema), createTask);
tasks.put("/:id", validateRequest(updateTaskSchema), updateTask);

export default tasks;
