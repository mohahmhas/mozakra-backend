import { CourseRepository } from '../repositories/course.repository.js';

import type { CreateCourseInput } from '../schema/create-course.schema.js';

import { AppError } from '../../../common/errors/app-error.js';
import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js';

export class CourseService {
    constructor(  private readonly repository =
      new CourseRepository(),) { }
 async createCourse(
  instructorId: string,
  data: CreateCourseInput,
) {
  const course =
    await this.repository.create({
      title: data.title,

      description:
        data.description ?? null,

      thumbnail:
        data.thumbnail ?? null,

      price: data.price,

      instructor: {
        connect: {
          id: instructorId,
        },
      },
    });

  return course;
}

async getCourse(coursId: string){
    const course=await this.repository.findById(coursId);
    if(!course){
        throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.COURSE_NOT_FOUND,
        message: 'Course not found.',
      });
      return course;
      
    }
}
    async getInstructorCourses(
    instructorId: string,
  ) {
    return this.repository.findByInstructorId(
      instructorId,
    );
  }

}
