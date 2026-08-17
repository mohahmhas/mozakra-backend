import { Router } from "express";

import { SessionController } from "../controllers/session.controller.js";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = Router();

const sessionController = new SessionController();

router.get(
  "/sessions",
  authMiddleware,
  sessionController.getSessions,
);

router.delete(
  "/sessions/:sessionId",
  authMiddleware,
  sessionController.revokeSession,
);

router.delete(
  "/sessions",
  authMiddleware,
  sessionController.revokeAllSessions,
);