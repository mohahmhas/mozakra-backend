import { EnrollmentRepository } from '../repositories/enrollment.repository.js';
import { CourseRepository } from '../../courses/repositories/course.repository.js';

import { AppError } from '../../../common/errors/app-error.js';
import { HTTP_STATUS } from '../../../common/constants/http-status.js';
import { ERROR_CODES } from '../../../common/constants/error-codes.js';

export class EnrollmentService {
    constructor(
    private readonly enrollmentRepository =
      new EnrollmentRepository(),

    private readonly courseRepository =
      new CourseRepository(),
  ) {}

    async enroll(
        userId: string,
        courseId: string,
    ){
        const course=await this.courseRepository.findById(courseId);
        if(!course){
            throw new AppError({
                statusCode: HTTP_STATUS.NOT_FOUND,
                code: ERROR_CODES.COURSE_NOT_FOUND,
                message: 'Course not found.',   
              });
        }
        if(course.instructorId===userId){
            throw new AppError({
                statusCode: HTTP_STATUS.FORBIDDEN,
                code: ERROR_CODES.FORBIDDEN,
                message: 'You are not allowed to enroll in your own course.',
              });
        }

        const existingEnrollment=await this.enrollmentRepository.findByUserAndCourse(userId,courseId);
        if(existingEnrollment){
            throw new AppError({
                statusCode: HTTP_STATUS.CONFLICT,
                code: ERROR_CODES.CONFLICT,
                message: 'You are already enrolled in this course.',
              });
        }

        return this.enrollmentRepository.create(userId,courseId);
    }

    async getMyEnrollments(userId: string){

        return this.enrollmentRepository.findByUserId(userId);
    }

    async getEnrollment(
        userId: string,
        courseId: string,
    ){
        const enrollments=await this.enrollmentRepository.findByUserAndCourse(userId,courseId);
        if(!enrollments){
            throw new AppError({
                statusCode: HTTP_STATUS.NOT_FOUND,
                code: ERROR_CODES.ENROLLMENT_NOT_FOUND,
                message: 'Enrollment not found.',
              });
        }
        return enrollments;
    }

      async unenroll(
    userId: string,
    courseId: string,
  ): Promise<void> {

    const enrollment =
      await this.enrollmentRepository.findByUserAndCourse(
        userId,
        courseId,
      );

    if (!enrollment) {
      throw new AppError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        code: ERROR_CODES.ENROLLMENT_NOT_FOUND,
        message: 'Enrollment not found.',
      });
    }

    await this.enrollmentRepository.delete(
      userId,
      courseId,
    );
  }
}