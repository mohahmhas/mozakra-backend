import { SessionRepository } from '../repositories/session.repository.js';

import { AppError } from '../../../common/errors/app-error.js';

import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js';

export class SessionService {
  constructor(
    private readonly sessionRepository = new SessionRepository(),
  ) {}

  async getUserSessions(userId: string) {
    return this.sessionRepository.findByUserId(userId);
  }

  async revokeSession(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    const session =
      await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.SESSION_NOT_FOUND,
        message: 'Session not found.',
      });
    }

    if (session.userId !== userId) {
      throw new AppError({
        statusCode: HTTP_STATUS.FORBIDDEN,
        code: ERROR_CODES.FORBIDDEN,
        message: 'You cannot revoke this session.',
      });
    }

    await this.sessionRepository.delete(sessionId);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.sessionRepository.deleteAllByUserId(userId);
  }
}