import type {
  Request,
  Response,
} from 'express';

import { CourseService } from '../services/course.service.js'
import { success } from 'zod';
import { AppError } from '../../../common/errors/app-error.js';
import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js';

export class CourseController {
    constructor(
        private readonly service =
      new CourseService(),
    ){}

    createCourse =async (req: Request,res: Response,):Promise<void>=>{
        const course = await this.service.createCourse(
            req.user!.id,
            req.body
        );

        res.status(201).json({
            success:true,
             message: 'Course created successfully.',
            data: course,
        });

    };

getCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { courseId } = req.params;

  if (typeof courseId !== 'string') {
    throw new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.INVALID_COURSE_ID,
      message: 'Invalid course ID.',
    });
  }

  const course =
    await this.service.getCourse(courseId);

  res.status(200).json({
    success: true,
    message: 'Course retrieved successfully.',
    data: course,
  });
};



    getMyCourses = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const courses =
      await this.service.getInstructorCourses(
        req.user!.id,
      );

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully.',
      data: courses,
    });
  };

  updateCourse = async (
    req: Request,
    res: Response,
  ):Promise<void> =>{
    const { courseId } = req.params;

  if (typeof courseId !== 'string') {
    throw new AppError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.INVALID_COURSE_ID,
      message: 'Invalid course ID.',
    });
  }

    const course = await this.service.updateCourse(
      req.user!.id,
      courseId,
      req.body,
    );
    res.status(200).json({
      success:true,
      message: 'Course updated successfully.',
    data: course,
    })
  }



}