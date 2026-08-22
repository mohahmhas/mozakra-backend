import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../../../common/errors/app-error.js';
import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js'; 
import type { UpdateUserInput }  from '../schemas/update-user.schema.js';

export class UserService {

  constructor(
    private readonly repository =
      new UserRepository(),
  ) {}

  async getProfile(
    userId: string,
  ) {
    const user =
      await this.repository.findById(userId);

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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(
    userId: string,
    data: UpdateUserInput,
  ) {

    if (data.email) {
      const existingUser =
        await this.repository.findByEmail(
          data.email,
        );

      if (
        existingUser &&
        existingUser.id !== userId
      ) {
        throw new AppError({
          statusCode: HTTP_STATUS.CONFLICT,
          code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
          message:
            'Email is already in use.',
        });
      }
    }

    const user =
      await this.repository.update(
        userId,
        data,
      );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deleteAccount(
    userId: string,
  ): Promise<void> {

    const user =
      await this.repository.findById(userId);

    if (!user) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found.',
      });
    }

    await this.repository.delete(userId);
  }
}