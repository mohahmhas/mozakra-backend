import { Router } from 'express';

import { CourseController } from '../controllers/course.controller.js';

import { authMiddleware } from '../../../middlewares/auth.middleware.js';

import { validate } from '../../../middlewares/validate.middleware.js';

import { createCourseSchema } from '../schema/create-course.schema.js';

const router = Router();

const courseController =
  new CourseController();

router.post(
  '/',
  authMiddleware,
  validate({
    body: createCourseSchema,
  }),
  courseController.createCourse,
);

router.get(
  '/my',
  authMiddleware,
  courseController.getMyCourses,
);

router.get(
  '/:courseId',
  authMiddleware,
  courseController.getCourse,
);

export default router;