import express from "express";
import cors from "cors";
import mainRoute from "./routes/mainRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", mainRoute);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  error.statusCode = 404;

  next(error);
});

// Global error handler - MUST BE LAST
app.use(errorHandler);

export default app;