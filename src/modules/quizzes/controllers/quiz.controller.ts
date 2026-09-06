import type { Request, Response } from "express";
import { QuizService } from "../services/quiz.service.js";

export class QuizController {
  constructor(
    private readonly service = new QuizService(),
  ) {}  

  createQuiz = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const quiz = await this.service.createQuiz(
      req.user!.id,
      req.params.lessonId as string,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Quiz created successfully.",
      data: quiz,
    });
  };

  getQuizById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const quiz = await this.service.getQuizById(
      req.params.quizId as string,
    );

    res.status(200).json({
      success: true,
      message: "Quiz retrieved successfully.",
      data: quiz,
    });
  };

  getQuizByLessonId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const quiz = await this.service.getQuizzesByLessonId(
      req.params.lessonId as string,
    );

    res.status(200).json({
      success: true,
      message: "Quiz retrieved successfully.",
      data: quiz,
    });
  };

  updateQuiz = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const quiz = await this.service.updateQuiz(
      req.user!.id,
      req.params.quizId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully.",
      data: quiz,
    });
  };

  deleteQuiz = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.service.deleteQuiz(
      req.user!.id,
      req.params.quizId as string,
    );

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully.",
    });
  };
}