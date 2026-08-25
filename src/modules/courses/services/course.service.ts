import { CourseRepository } from '../repositories/course.repository.js';

import type { CreateCourseInput } from '../schema/create-course.schema.js';
import type { UpdateCourseInput } from '../schema/update-course.schema.js';

import type { Prisma } from '../../../generated/prisma/client.js';    

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

  async updateCourse(
  instructorId: string,
  courseId: string,
  data: UpdateCourseInput,
) {
  const course = await this.repository.findById(courseId);

  if(!course){
       throw new AppError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.COURSE_NOT_FOUND,
      message: 'Course not found.',
    });
  }

  if(course.instructorId !== instructorId){
       throw new AppError({
      statusCode: HTTP_STATUS.FORBIDDEN,
      code: ERROR_CODES.FORBIDDEN,
      message: 'You are not authorized to update this course.',
    });
  }

  const updateData : Prisma.CourseUpdateInput = {};

  if(data.title !== undefined){
      updateData.title=data.title;
  }
   if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.thumbnail !== undefined) {
    updateData.thumbnail = data.thumbnail;
  }

  if (data.price !== undefined) {
    updateData.price = data.price;
  }

  if (data.isPublished !== undefined) {
    updateData.isPublished = data.isPublished;
  }

  return this.repository.update(courseId, updateData);  

}

async deleteCourse(
  instructorId: string,
  courseId: string,
): Promise<void> {
   const course =
    await this.repository.findById(courseId);

      if (!course) {
    throw new AppError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.COURSE_NOT_FOUND,
      message: 'Course not found.',
    });
  }

  if (course.instructorId !== instructorId) {
    throw new AppError({
      statusCode: HTTP_STATUS.FORBIDDEN,
      code: ERROR_CODES.FORBIDDEN,
      message:
        'You are not allowed to delete this course.',
    });
  } 


  await this.repository.delete(courseId);
}


}
