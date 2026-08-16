import { Router } from "express";
import * as adminController from "../controller/adminController.js"

const adminRoute = Router();

adminRoute.get("/dashboard", adminController.adminDashboard);

export default adminRoute;
