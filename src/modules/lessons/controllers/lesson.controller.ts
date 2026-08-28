import type { Request, Response } from "express";

import { LessonService } from "../services/lesson.service.js";


export class LessonController {
    constructor(
        private readonly service = new LessonService(),) { }

    createLesson = async (req: Request, res: Response): Promise<void> => {
        const lesson = await this.service.createLesson(
            req.user!.id, req.params.coursId as string, req.body);

        res.status(201).json({
            success: true,
            message: 'Lesson created successfully.',
            data: lesson,
        });
    }

    getCoursLesson = async (req: Request, res: Response): Promise<void> => {
        const lessons = await this.service.getCourseLessons(req.params.coursId as string);
        res.status(200).json({
            success: true,
            message: 'Lessons retrieved successfully.',
            data: lessons,
        });
    }

    getLessonById = async (req: Request, res: Response): Promise<void> => {
        const lesson = await this.service.getLessonById(req.params.lessonId as string);
        res.status(200).json({
            success: true,
            message: 'Lesson retrieved successfully.',
            data: lesson,
        });

    }

    updateLesson = async (req: Request, res: Response): Promise<void> => {
        const lesson = await this.service.updateLesson(
            req.user!.id,
            req.params.lessonId as string,
            req.body,
        );
        res.status(200).json({
            success: true,
            message: 'Lesson updated successfully.',
            data: lesson,
        });
    };

    deleteLesson = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        await this.service.lessonDelete(
            req.user!.id,
            req.params.lessonId as string,
        );

        res.status(200).json({
            success: true,
            message: 'Lesson deleted successfully.',
        });
    };
}