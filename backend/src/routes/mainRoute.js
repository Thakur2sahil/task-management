import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authRoute from "./authRoute.js";
import taskRoute from "./taskRoute.js";
import userRoute from "./userRoute.js";
import adminRoute from "./adminRoute.js";


const mainRoute = Router();

mainRoute.use('/auth', authRoute)

mainRoute.use(authMiddleware)

mainRoute.use('/task', taskRoute)
mainRoute.use('/user', userRoute)
mainRoute.use('/admin',adminRoute )



export default mainRoute;