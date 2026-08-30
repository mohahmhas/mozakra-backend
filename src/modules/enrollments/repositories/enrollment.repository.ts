import { prisma } from '../../../config/prisma.js';

import type { Prisma, Enrollment } from '../../../generated/prisma/client.js';

export class EnrollmentRepository{
    async create( userId: string,
    courseId: string,
  ): Promise<Enrollment> {
    return prisma.enrollment.create({
        data: {
            userId,
            courseId
        }
    });
  };

  async findByUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    return prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
       
      },
    });
  };

  async findByUserId(userId: string): Promise<Enrollment[]> {
    return prisma.enrollment.findMany({
      where: {
        userId,
      },
       orderBy: {
        enrolledAt: 'desc',
      },
    });
  };

  async findByCourseId(courseId:string):Promise<Enrollment[]>{
    return prisma.enrollment.findMany({
      where: {
        courseId,
      },
       orderBy: {
        enrolledAt: 'desc',
      },
    })
  };

  async delete(id: string ,courseId:string): Promise<void> {
    await prisma.enrollment.delete({ where: { id ,courseId} });
  };


}