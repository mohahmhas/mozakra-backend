import { prisma } from "../../../config/prisma.js";

import type { LessonProgress } from "../../../generated/prisma/client.js";

export class ProgressRepository {
    async create(
        userId: string,
        lessonId: string,
        progress: number,
        completed: boolean
    ): Promise<LessonProgress> {
        return prisma.lessonProgress.create({
            data: {
                userId,
                lessonId,
                progress,
                completed,
            },
        });
    }

    async findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgress | null> {
        return prisma.lessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                },
            }
        })
    }

    async update(id:string,progress: number, completed:boolean): Promise<LessonProgress>{
        return prisma.lessonProgress.update({
            where:{
                id,
            },
            data:{
                progress,
                completed,
            }
        })
    }

    async findByUserAndCourse(userId: string, courseId:string){
        return prisma.lessonProgress.findMany({
            where:{
                userId,
                lesson:{
                    courseId,
                },
            },
            orderBy:{
                lesson:{
                    order: 'asc',
                }
            }
        })
    }
}