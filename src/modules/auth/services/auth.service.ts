import { AuthRepository } from '../repositories/auth.repository.js';

import type { RegisterInput } from '../schemas/register.schema.js';

import type { LoginSchema } from '../schemas/login.schema.js';

import { AppError } from '../../../common/errors/app-error.js';

import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js';

import { hashPassword } from '../../../common/helpers/password.helper.js';

import { comparePassword } from '../../../common/helpers/password.helper.js';

import { generateAccessToken, generateRefreshToken } from '../../../common/helpers/jwt.helper.js';

export class AuthService {
  constructor(
    private readonly repository = new AuthRepository(),
  ) { }

  async login(data: LoginSchema){
    const user =await this.repository.findByEmail(data.email);
    if(!user){
      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      });
    }
        const isPasswordValid =
        await comparePassword(
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
        const accessToken = generateAccessToken({
            userId: user.id,
        });
        const refreshToken = generateRefreshToken({
            userId: user.id,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken,
        };
  }
  async register(data: RegisterInput) {
    const existingUser = await this.repository.findByEmail(
      data.email,
    );

    if (existingUser) {
      throw new AppError({
        statusCode: HTTP_STATUS.CONFLICT,
        code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
        message: 'This User already exists',
      });
    }

    const hashedPassword = await hashPassword(
      data.password,
    );

    const user = await this.repository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
    const accessToken = generateAccessToken({
      userId: user.id,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }
}