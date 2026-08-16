import { Router } from "express";
import * as authController from "../controller/authController.js"

const authRoute = Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.register);

export default authRoute;
