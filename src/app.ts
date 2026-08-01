import express from "express";

import { registerMiddlewares } from "./middlewares/index.js";
import { registerRoutes } from "./routes/index.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();


registerMiddlewares(app);


registerRoutes(app);


/**
 * Handle unknown routes
 */
app.use(notFoundMiddleware);

/**
 * Global error handler
 */
app.use(errorMiddleware);
export default app;