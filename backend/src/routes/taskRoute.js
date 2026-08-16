import { Router } from "express";
import * as taskController from "../controller/taskController.js"

const taskRoute = Router();

taskRoute.get("/", taskController.allTask);
taskRoute.get("/user", taskController.taskUser);
taskRoute.get("/:id", taskController.taskById);
taskRoute.patch("/:id/status", taskController.status);


taskRoute.post("/add", taskController.addTask);
taskRoute.put("/update/:id", taskController.updatedTask);
taskRoute.delete("/delete/:id", taskController.deleteTask);


export default taskRoute;
