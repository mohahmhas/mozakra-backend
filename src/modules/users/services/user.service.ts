import { UserRepository } from '../repositories/user.repository.js';
import { SessionRepository } from '../../auth/repositories/session.repository.js';
import type{ ChangePasswordInput } from '../schemas/change-password.schema.js';
import { comparePassword } from '../../../common/helpers/password.helper.js';
import { hashPassword } from '../../../common/helpers/password.helper.js';
import { AppError } from '../../../common/errors/app-error.js';
import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js'; 
import type { UpdateUserInput }  from '../schemas/update-user.schema.js';
import type { Prisma } from "../../../generated/prisma/client.js";

export class UserService {

  constructor(
    private readonly repository =
      new UserRepository(),
    
    private readonly sessionRepository =
      new SessionRepository(),
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
  const updateData: Prisma.UserUpdateInput = {};

if (data.name !== undefined) {
  updateData.name = data.name;
}

if (data.email !== undefined) {
  updateData.email = data.email;
}
    const user =
      await this.repository.update(
        userId,
        updateData,
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

  async changePassword(
    usrId: string,
    data: ChangePasswordInput,
  ): Promise<void> {
    const user = await this.repository.findById(usrId);
    if(!user){
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found.',
      });
    }
    const isCurrentPasswordValid = await comparePassword(
      data.currentPassword,
      user.password,
    );
    if(!isCurrentPasswordValid){
      throw new AppError({
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      });
    }

  const hashedPassword =
    await hashPassword(data.newPassword);

    await this.repository.update(
      usrId,
      {
        password: hashedPassword,
      },
    );
    await this.sessionRepository.deleteAllByUserId(usrId);
  }
}