import type { Request,Response } from "express";

import { EnrollmentService } from "../services/enrollment.service.js";



export class EnrollmentController {

  constructor(
    private readonly service = new EnrollmentService(),
  ) {}  

  //POST /courses/:courseId/enroll
 enroll= async (
    req: Request,
    res: Response,
  ): Promise<void> => {
const enrollment =
      await this.service.enroll(
        req.user!.id,
        req.params.courseId as string,
      );
  res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully.',
      data: enrollment,
    });    
    }

    //GET /enrollments
    getMyEnrollments= async (
        req: Request,
        res: Response,
      ): Promise<void> => {
        const enrollments = await this.service.getMyEnrollments(req.user!.id);
        res.status(200).json({
          success: true,
          message: 'My enrollments retrieved successfully.',
          data: enrollments,
        });
      }

      //GET /courses/:courseId/enrollment

      getEnrollment=async(req:Request,res:Response):Promise<void>=>{
        const enrollment = await this.service.getEnrollment(req.user!.id,req.params.courseId as string);
        res.status(200).json({
          success: true,
          message: 'Enrollment retrieved successfully.',
          data: enrollment,
        });
      }

      //DELETE /courses/:courseId/enroll
      unenroll= async (req:Request,res:Response):Promise<void>=>{
        await this.service.unenroll(req.user!.id,req.params.courseId as string);
        res.status(200).json({
          success: true,
          message: 'Unenrolled from course successfully.',
        });
      }

}