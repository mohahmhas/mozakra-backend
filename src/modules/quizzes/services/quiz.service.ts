import { QuizRepository } from "../repositories/quiz.repository.js";

import { AppError } from "../../../common/errors/app-error.js";
import { ERROR_CODES } from "../../../common/constants/error-codes.js";
import { HTTP_STATUS } from "../../../common/constants/http-status.js";

export class QuizService {
    constructor(
        private readonly quizRepository = new QuizRepository(),
    ) { }

    async createQuiz(
        userId: string,
        lessonId: string,
        data: {
            title: string;
            description?: string;
            passingScore?: number;
        },

    ) {
        const lesson = await this.quizRepository.lessonExists(lessonId);
        if (!lesson) {
            throw new AppError({
                statusCode: HTTP_STATUS.NOT_FOUND,
                code: ERROR_CODES.LESSON_NOT_FOUND,
                message: `Lesson with id ${lessonId} not found`,
            });
        }
        if (lesson.course.instructorId !== userId) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.FORBIDDEN,
                    code: ERROR_CODES.FORBIDDEN,
                    message: `You are not authorized to create a quiz for this lesson`,
                }
            );
        }

        const existingQuiz = await this.quizRepository.findByLessonId(lessonId);
        if (existingQuiz.length > 0) {
            throw new AppError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                code: ERROR_CODES.QUIZ_ALREADY_EXISTS,
                message: 'A quiz already exists for this lesson',
            });
        }

        const passingScore = data.passingScore ?? 60;

        if (passingScore < 0 || passingScore > 100) {
            throw new AppError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                code: ERROR_CODES.INVALID_PASSING_SCORE,
                message: 'Passing score must be between 0 and 100',
            });
        }

        return this.quizRepository.create(
            lessonId,
            data.title,
            data.description ?? null,
            passingScore,
        );
    }

    async getQuizById(quizId: string) {
        const quiz = await this.quizRepository.findById(quizId);

        if (!quiz) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    code: ERROR_CODES.NOT_FOUND,
                    message: `Quiz with id ${quizId} not found`,
                }
            );
        }

        return quiz;
    }

    async getQuizzesByLessonId(lessonId: string) {
        const quiz = await this.quizRepository.findByLessonId(lessonId);
        if (!quiz) {
            throw new AppError({
                statusCode: HTTP_STATUS.NOT_FOUND,
                code: ERROR_CODES.NOT_FOUND,
                message: `Quizzes for lesson with id ${lessonId} not found`,
            });
        }

        return quiz;

    }

    async updateQuiz(userId: string,
        quizId: string,
        data: {
            title: string;
            description?: string;
            passingScore?: number;
        },
    ) {
        const quiz = await this.quizRepository.findById(quizId);

        if (!quiz) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    code: ERROR_CODES.NOT_FOUND,
                    message: `Quiz with id ${quizId} not found`,
                }
            );
        }
        if (quiz.questions.length >= 0) {
            // Authorization will be checked using the lesson owner below.
        }

        const lesson = await this.quizRepository.lessonExists(quiz.lessonId);
        if (!lesson) {
            throw new AppError({
                statusCode: HTTP_STATUS.NOT_FOUND,
                code: ERROR_CODES.LESSON_NOT_FOUND,
                message: `Lesson with id ${quiz.lessonId} not found`,
            });

        }

        if (lesson.course.instructorId !== userId) {
            throw new AppError({
                statusCode: HTTP_STATUS.FORBIDDEN,
                code: ERROR_CODES.FORBIDDEN,
                message: 'You are not the owner of this lesson',
            });
        }

        if (
            data.passingScore !== undefined &&
            (data.passingScore < 1 || data.passingScore > 100)
        ) {
            throw new AppError({
                statusCode: HTTP_STATUS.BAD_REQUEST,
                code: ERROR_CODES.INVALID_PASSING_SCORE,
                message: 'Passing score must be between 1 and 100',
            });
        }
        return this.quizRepository.update(quizId, data);
    }

    async deleteQuiz(userId: string, quizId: string) {
        const quiz = await this.quizRepository.findById(quizId);
        
        if (!quiz) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    code: ERROR_CODES.NOT_FOUND,
                    message: `Quiz with id ${quizId} not found`,
                }
            );
        }

        const lesson = await this.quizRepository.lessonExists(quiz.lessonId);
        if (!lesson) {
            throw new AppError({
                statusCode: HTTP_STATUS.NOT_FOUND,
                code: ERROR_CODES.LESSON_NOT_FOUND,
                message: `Lesson with id ${quiz.lessonId} not found`,
            });
        }

        if (lesson.course.instructorId !== userId) {
            throw new AppError({
                statusCode: HTTP_STATUS.FORBIDDEN,
                code: ERROR_CODES.FORBIDDEN,
                message: 'You are not the owner of this lesson',
            });
        }

        return this.quizRepository.delete(quizId);
    }
}