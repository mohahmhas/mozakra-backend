import type {Request, Response} from "express";

import { ProgressService } from "../service/progress.service.js";

export class ProgressController {
    constructor(private readonly progressService = new ProgressService()) { }

      updateLessonProgress = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const  progress =this.progressService.updateProgress(
        req.user!.id,
        req.params.lessonId as string,
        req.body.progress,
    );
    res.status(200).json({
        success: true,
        message:"Progress updated successfully.",
        data: progress,
    });


  }

  getLessonProgress = async (req:Request, res:Response):Promise<void>=>{
    const progress = await this.progressService.getLessonProgress(
      req.user!.id,
      req.params.lessonId as string,
    );

    res.status(200).json({
      success: true,
      message:"Lesson progress retrieved successfully.",
      data: progress,
    });
    
  };

  getCourseProgress = async (req:Request, res:Response):Promise<void>=>{
    const progress = await this.progressService.getCourseProgress(
      req.user!.id,
      req.params.courseId as string,
    );

    res.status(200).json({
      success: true,
      message:"Course progress retrieved successfully.",
      data: progress,
    });
  }



}