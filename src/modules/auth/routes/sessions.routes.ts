import { Router } from "express";

import { SessionController } from "../controllers/session.controller.js";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = Router();

const sessionController = new SessionController();

router.get(
  "/",
  authMiddleware,
  sessionController.getSessions,
);

router.delete(
  "/:sessionId",
  authMiddleware,
  sessionController.revokeSession,
);

router.delete(
  "/",
  authMiddleware,
  sessionController.revokeAllSessions,
);

export default router;