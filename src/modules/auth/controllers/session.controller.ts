import type {
  Request,
  Response,
} from "express";

import { SessionService } from "../services/session.service.js";
import { AppError } from "../../../common/errors/app-error.js";
import { HTTP_STATUS } from "../../../common/constants/http-status.js";
import { ERROR_CODES } from "../../../common/constants/error-codes.js";

export class SessionController {
  constructor(
    private readonly service =
      new SessionService(),
  ) {}

  getSessions = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const sessions =
      await this.service.getUserSessions(
        req.user!.id,
      );

    res.status(200).json({
      success: true,
      message:
        "Sessions retrieved successfully.",
      data: sessions,
    });
  };

  revokeSession = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const sessionId = req.params.sessionId;
   if (typeof sessionId !== "string") {
    throw new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.INVALID_SESSION_ID,
      message: "Invalid session ID.",
    });
  }
    res.status(200).json({
      success: true,
      message: "Session revoked successfully.",
    });
  };

  revokeAllSessions = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.service.revokeAllSessions(
      req.user!.id,
    );

    res.status(200).json({
      success: true,
      message:
        "All sessions revoked successfully.",
    });
  };
}