import { Router } from "express";
import { getAllTasks, getTask } from "./controller";

const tasks: Router = Router();

tasks.get("/", getAllTasks);
tasks.get("/:id", getTask);

export default tasks;
