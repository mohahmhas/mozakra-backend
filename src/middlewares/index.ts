import type { Express } from "express";
import express from "express";

import { loggerMiddleware } from "./logger.middleware.js";
import { helmetMiddleware } from "./helmet.middleware.js";
import { corsMiddleware } from "./cors.middleware.js";
import { compressionMiddleware } from "./compression.middleware.js";
import { cookieMiddleware } from "./cookie.middleware.js";

export const registerMiddlewares = (app: Express): void => {
  app.use(loggerMiddleware);

  app.use(helmetMiddleware);

  app.use(corsMiddleware);

  app.use(compressionMiddleware);

  app.use(cookieMiddleware);

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));
};