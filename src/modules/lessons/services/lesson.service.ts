import { LessonRepository } from '../repositories/lesson.repository.js';

import { CourseRepository } from '../../courses/repositories/course.repository.js';

import type { CreateLessonInput } from '../schemas/lesson.schema.js';
import type {  UpdateLessonInput, } from '../schemas/updat-lesson-schema.js';

import { AppError } from '../../../common/errors/app-error.js';
import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js';
import { string } from 'zod';

export class LessonService{
  constructor(
      private readonly repository =
      new LessonRepository(),

    private readonly courseRepository =
      new CourseRepository(),
  ){}

  async createLesson(
    userId: string,
    courseId: string,
    data: CreateLessonInput,
  ){
       const course =
      await this.courseRepository.findById(courseId);

      if (!course){
        throw new AppError({
          statusCode: HTTP_STATUS.NOT_FOUND,
          code: ERROR_CODES.COURSE_NOT_FOUND,
          message: 'Course not found.',
        });

      }
      if(course.instructorId !== userId){
        throw new AppError({
          statusCode: HTTP_STATUS.FORBIDDEN,
          code: ERROR_CODES.FORBIDDEN,
          message: 'You are not authorized to create a lesson for this course.',
        });
       
      }
       const existingLesson = await this.repository.findByCourseId(
          courseId,);

  
  const orderExists =
      existingLesson.some(
        (lesson) => lesson.order === data.order,
      );

         if (orderExists) {
      throw new AppError({
        statusCode: HTTP_STATUS.CONFLICT,
        code: ERROR_CODES.CONFLICT,
        message:
          'A lesson with this order already exists.',
      });
    }

  return this.repository.create({
     title: data.title,

  description:
    data.description ?? null,

  videoUrl:
    data.videoUrl ?? null,

  duration:
    data.duration ?? null,

  order: data.order,

      course: {
        connect: {
          id: courseId,
        },
      },
    });
  }

    async getCourseLessons(courseId: string) {
    const course=await this.courseRepository.findById(courseId);
    if(!course){
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.COURSE_NOT_FOUND,
        message: 'Course not found.',   
      });
    }

    return this.repository.findByCourseId(courseId);
    
  }

  async getLessonById(lessonId: string) {
    const lesson=await this.repository.findById(lessonId);
      if(!lesson){
        throw new AppError({
          statusCode: HTTP_STATUS.NOT_FOUND,
          code: ERROR_CODES.LESSON_NOT_FOUND,
          message: 'Lesson not found.',
        });

      }
      return lesson;
  }
  
  async updateLesson(userId : string , lessonId: string ,data: UpdateLessonInput,){
    const lesson = await this.repository.findById(lessonId);
    if(!lesson){
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.LESSON_NOT_FOUND,
        message: 'Lesson not found.',
      });
    }
    const course=await this.courseRepository.findById(lesson.courseId);
    if(!course){
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.COURSE_NOT_FOUND,
        message: 'Course not found.',
      });
    }
    if(course.instructorId !== userId){
      throw new AppError({
        statusCode: HTTP_STATUS.FORBIDDEN,
        code: ERROR_CODES.FORBIDDEN,
        message: 'You are not authorized to update this lesson.',
      });
    }

    if(data.order !== undefined && data.order !== lesson.order){
         const lessons =
        await this.repository.findByCourseId(
          lesson.courseId,
        );

      const orderExists =
        lessons.some(
          (lesson) => lesson.order === data.order,
        );

      if (orderExists) {
        throw new AppError({
          statusCode: HTTP_STATUS.CONFLICT,
          code: ERROR_CODES.CONFLICT,
          message:
            'A lesson with this order already exists.',
        });
      }

      const lessonData={
        order: data.order,
      };

      return this.repository.update(lessonId,lessonData);
    }


  


  }


  async lessonDelete(  userId: string,
    lessonId: string,){
      const lesson=await this.repository.findById(lessonId);
      if(!lesson){
        throw new AppError({
          statusCode: HTTP_STATUS.NOT_FOUND,
          code: ERROR_CODES.LESSON_NOT_FOUND,
          message: 'Lesson not found.',
        });
      }

      const course =
      await this.courseRepository.findById(
        lesson.courseId,
      );

    if (!course) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.COURSE_NOT_FOUND,
        message: 'Course not found.',
      });
    }

    if (course.instructorId !== userId) {
      throw new AppError({
        statusCode: HTTP_STATUS.FORBIDDEN,
        code: ERROR_CODES.FORBIDDEN,
        message:
          'You are not allowed to modify this course.',
      });
    }
      return this.repository.delete(lessonId);
    }

}