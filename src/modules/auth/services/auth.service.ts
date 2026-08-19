import { AuthRepository } from '../repositories/auth.repository.js';
import { SessionRepository } from "../repositories/session.repository.js";


import type { RegisterInput } from '../schemas/register.schema.js';

import type { LoginSchema } from '../schemas/login.schema.js';

import { AppError } from '../../../common/errors/app-error.js';

import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js';

import { hashPassword } from '../../../common/helpers/password.helper.js';

import { comparePassword } from '../../../common/helpers/password.helper.js';

import type { SessionMetadata } from '../types/auth.types.js';

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../common/helpers/jwt.helper.js';
import { env } from '../../../config/env.js';


export class AuthService {
  constructor(
    private readonly repository = new AuthRepository(),
    private readonly sessionRepository = new SessionRepository(),

  ) { }



  async register(data: RegisterInput,metadata: SessionMetadata) {
    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError({
        statusCode: HTTP_STATUS.CONFLICT,
        code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
        message: 'This User already exists',
      });
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.repository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } =
      await this.createSessionTokens(user.id,metadata);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginSchema,metadata: SessionMetadata) {
    const user = await this.repository.findByEmail(data.email);

    if (!user) {
      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      });
    }

    const { accessToken, refreshToken } =
      await this.createSessionTokens(user.id,metadata);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    refreshToken: string,
  ) {

    const payload = verifyRefreshToken(refreshToken);
    const session = await this.sessionRepository.findById(payload.sessionId);
    if (!session) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.SESSION_NOT_FOUND,
        message: 'Session not found.',
      });
    }
  if(session.userId !== payload.sub){
    throw new AppError({
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Unauthorized refresh attempt.',
    })
  }
    if (session.expiresAt < new Date()) {
      await this.sessionRepository.delete(session.id);

      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.SESSION_EXPIRED,
        message: "Session expired.",
      });
    }
    if (!session.refreshTokenHash) {
      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.INVALID_REFRESH_TOKEN,
        message: 'Invalid refresh token.',
      });
    }

    const isRefreshTokenValid =
      await comparePassword(
        refreshToken,
        session.refreshTokenHash,
      );

    if (!isRefreshTokenValid) {
      await this.sessionRepository.deleteAllByUserId(payload.sub);

      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.INVALID_REFRESH_TOKEN,
        message: 'Refresh token reuse detected. Please login again.',
      });
    }
    const newRefreshToken = generateRefreshToken({
      sub: payload.sub,
      sessionId: session.id,
    });

    const newRefreshTokenHash = await hashPassword(newRefreshToken);
    const rotationSuccessded= await this.sessionRepository.rotateRefreshToken(
      session.id,
      session.refreshTokenHash,
      newRefreshTokenHash,
      new Date(),
    );
    if(!rotationSuccessded){
       await this.sessionRepository.deleteAllByUserId(
      payload.sub,
    );

    throw new AppError({
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      code: ERROR_CODES.INVALID_REFRESH_TOKEN,
      message:
        'Refresh token reuse detected. Please login again.',
    });
    }

    const accessToken = generateAccessToken({
      sub: payload.sub,
    });


    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }





  async me(userId: string) {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found.',
      });

    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }


  private async createSessionTokens(userId: string ,metadata:SessionMetadata) {
    const session = await this.sessionRepository.create({
   
      user: {
        connect: {
          id: userId,
        },
      },
      expiresAt: new Date(
        Date.now() + env.JWT_REFRESH_EXPIRES_IN_DAYS *
        24 *
        60 *
        60 *
        1000,
      ),
        ipAddress: metadata.ipAddress ?? null,
    userAgent: metadata.userAgent ?? null,


      lastUsedAt: new Date(),
    });

    const refreshToken = generateRefreshToken({
      sub: userId,
      sessionId: session.id,
    });

    const refreshTokenHash = await hashPassword(refreshToken);

    await this.sessionRepository.update(
  session.id,
  {
    refreshTokenHash: refreshTokenHash,
  
  },
);



    const accessToken = generateAccessToken({
      sub: userId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) : Promise<void>{
    const payload = verifyRefreshToken(refreshToken);
    const session = await this.sessionRepository.findById(payload.sessionId);
    if(session?.userId !== payload.sub){
      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Unauthorized logout attempt.',
      })
    }
    if (!session) {
      throw new AppError ({
        statusCode: HTTP_STATUS.NOT_FOUND,      
        code: ERROR_CODES.SESSION_NOT_FOUND,
         message: 'Session not found .',

      })
    }

    await this.sessionRepository.delete(session.id);
    

  }
}

