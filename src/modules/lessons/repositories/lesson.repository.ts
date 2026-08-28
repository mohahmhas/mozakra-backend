import { prisma } from "../../../config/prisma.js";
import type { Prisma, Lesson } from "../../../generated/prisma/client.js";
export class LessonRepository {
    async create(data: Prisma.LessonCreateInput): Promise<Lesson> {
        return prisma.lesson.create({ data });
    }


    async findById(id: string): Promise<Lesson | null> {
        return prisma.lesson.findUnique({ where: { id } });
    }       

   async findByCourseId(
    courseId: string,
  ): Promise<Lesson[]> {
    return prisma.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async update(id:string,data:Prisma.LessonUpdateInput):Promise<Lesson>{
      return prisma.lesson.update({where:{id},data});
  }

  async delete(id:string):Promise<void>{
    await prisma.lesson.delete({where:{id}});
  }
    
}