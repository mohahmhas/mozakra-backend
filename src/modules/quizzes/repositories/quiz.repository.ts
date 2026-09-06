import { prisma } from '../../../config/prisma.js';

export class QuizRepository {
    async create(lessonId: string,
        title: string,
        description: string | null,
        passingScore: number,
    ) {
        return prisma.quiz.create({
            data: {
                lessonId,
                title,
                description,
                passingScore,
            }
        });
    }
    async findById(quizId: string) {
        return prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    orderBy: { order: "asc" },

                    include: {
                        options: {
                            orderBy: { order: "asc" }
                        }
                    }
                },

            }
        });

    }

    async findByLessonId(lessonId: string) {
        return prisma.quiz.findMany({
            where: { lessonId },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                    include: {
                        options: {
                            orderBy: { order: "asc" }
                        },
                    },
                },
            },
        });
    }

    async update(quizId: string, data: {
        title?: string;
        description?: string | null;
        passingScore?: number;
    }) {
        return prisma.quiz.update({
            where: { id: quizId },
            data
        });
    }

    async delete(quizId: string) {
        return prisma.quiz.delete({
            where: { id: quizId },

        })
    }


    async lessonExists(lessonId: string) {
        return prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                courseId: true,
                course: {
                    select: {
                        instructorId: true,
                    }
                }

            }
        });
    }


}