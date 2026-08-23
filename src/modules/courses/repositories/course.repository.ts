import { prisma } from '../../../config/prisma.js';

import type { Prisma, Course } from '../../../generated/prisma/client.js';

export class CourseRepository {
    async create(data: Prisma.CourseCreateInput): Promise<Course> {
        return prisma.course.create({ data });
    }

    async findById(id: string): Promise<Course | null>{
        return prisma.course.findUnique({where:{id}});
    }

    async findByInstructorId(instructorId: string): Promise<Course[]>{
        return prisma.course.findMany({where:{instructorId}, orderBy:{createdAt:"desc"}});
    }

    async update(id: string, data: Prisma.CourseUpdateInput): Promise<Course>{
        return prisma.course.update({where:{id}, data});
    }
}