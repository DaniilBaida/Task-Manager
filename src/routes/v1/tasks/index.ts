import { Router } from "express";
import { getAllTasks, getTask } from "./controller";
import authenticateUser from "../../../middleware/authenticate-user";

const tasks: Router = Router();

tasks.use(authenticateUser);

tasks.get("/", getAllTasks);
tasks.get("/:id", getTask);

export default tasks;
