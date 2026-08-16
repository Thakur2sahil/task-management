import { Router } from "express";
import * as userController from "../controller/usersController.js"

const userRoute = Router();

userRoute.get("/", userController.allUsers);
userRoute.get("/dashboard", userController.userDashboard);


export default userRoute;
