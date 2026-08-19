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


  async findById(
    id: string,
): Promise<Session | null> {
    return prisma.session.findUnique({
        where: {
            id,
        },
    });
}

async update(
    sessionId: string,
    data: Prisma.SessionUpdateInput,
): Promise<void> {

    await prisma.session.update({

        where:{
            id:sessionId,
        },

        data,

    });

}


//this method is used for Atomically replaces the current refresh token hash.
//and  * Returns true only if the expected old hash  was still stored in the database.
   

  async rotateRefreshToken(sessionId: string,
    currentRefreshTokenHash: string,
    newRefreshTokenHash: string,
    lastUsedAt: Date,
  ): Promise<boolean>{
    const result = await prisma.session.updateMany({
      where: {
        id: sessionId,
        refreshTokenHash: currentRefreshTokenHash,
      },
      data:{
        refreshTokenHash: newRefreshTokenHash,
        lastUsedAt,
      }
    });
    return result.count === 1;
  }


  async findByUserIdForManagement(
    userId: string,
  ){
    return prisma.session.findMany({
      where:{
        userId,
      },
      select:{
        id: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      lastUsedAt: true,
      ipAddress: true,
      userAgent: true,
      },
      orderBy:{
        lastUsedAt: "desc",
      },
    });
  }
  

 

  async delete(
    sessionId: string,
  ): Promise<void> {
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




}

