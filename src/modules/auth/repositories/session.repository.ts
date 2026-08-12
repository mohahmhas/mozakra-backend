import { prisma } from '../../../config/prisma.js';

import type {
  Prisma,
  Session,
} from '../../../generated/prisma/client.js';

export class SessionRepository {
  async create(
    data: Prisma.SessionCreateInput,
  ): Promise<Session> {
    return prisma.session.create({
      data,
    });
  }

  async findByUserId(
    userId: string,
  ): Promise<Session[]> {
    return prisma.session.findMany({
      where: {
        userId,
      },
    });
  }

 

  async delete(
    sessionId: string,
  ): Promise<void> {
    console.log("Deleting session with ID:", sessionId);  
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async deleteAllByUserId(
    userId: string,
  ): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        userId,
      },
    });
  }

  async findById(
    id: string,
): Promise<Session | null> {
    return prisma.session.findUnique({
        where: {
            id,
        },
    });
}

async updateRefreshTokenHash(
    sessionId: string,
    refreshTokenHash: string,
): Promise<void> {

    await prisma.session.update({

        where:{
            id:sessionId,
        },

        data:{
            refreshTokenHash,
        },

    });

}
}

