import { ProgressRepository } from "../repository/progress.repository.js";

import { LessonRepository } from "../../lessons/repositories/lesson.repository.js";
import { EnrollmentRepository } from "../../enrollments/repositories/enrollment.repository.js";

import { AppError } from "../../../common/errors/app-error.js";
import { HTTP_STATUS } from "../../../common/constants/http-status.js";
import { ERROR_CODES } from "../../../common/constants/error-codes.js";

export class ProgressService {
    constructor(
        private readonly progressRepository = new ProgressRepository(),
        private readonly lessonRepository = new LessonRepository(),
        private readonly enrollmentRepository = new EnrollmentRepository(),
    ) { }

    async updateProgress(userId: string, lessonId: string, progress: number) {
        const lesson = await this.lessonRepository.findById(lessonId);
        if (!lesson) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    code: ERROR_CODES.LESSON_NOT_FOUND,
                    message: 'Lesson not found.',
                }
            );
        }

        const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, lesson.courseId);
        if (!enrollment) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.FORBIDDEN,
                    code: ERROR_CODES.USER_NOT_ENROLLED,
                    message: 'User is not enrolled in the course.',
                }
            );
        }
        if (progress < 0 || progress > 100) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    code: ERROR_CODES.VALIDATION_ERROR,
                    message: 'Progress must be between 0 and 100.',
                }
            );
        }

        const completed = progress === 100;


        const existingProgress =
            await this.progressRepository.findByUserAndLesson(
                userId,
                lessonId,
            );

        if (existingProgress) {
            return this.progressRepository.update(existingProgress.id, progress, completed);
        }
        return this.progressRepository.create(
            userId,
            lessonId,
            progress,
            completed
        );
    }

    async getLessonProgress(userId: string, lessonId: string) {
        const progress = await this.progressRepository.findByUserAndLesson(userId, lessonId);
        if (!progress) {
            throw new AppError(
                {
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    code: ERROR_CODES.PROGRESS_NOT_FOUND,
                    message: 'Progress not found.',
                }
            );
        }
        return progress;
    }

    async getCourseProgress(userId: string, courseId: string) {
        const enrollment =
            await this.enrollmentRepository.findByUserAndCourse(
                userId,
                courseId,
            );

        if (!enrollment) {
            throw new AppError({
                statusCode: HTTP_STATUS.FORBIDDEN,
                code: ERROR_CODES.NOT_ENROLLED,
                message: 'You are not enrolled in this course.',
            });
        }
        return this.progressRepository.findByUserAndCourse(
            userId,
            courseId,
        );
    }
}


