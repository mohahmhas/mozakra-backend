import { Router } from "express";

import { LessonController } from "../controllers/lesson.controller.js";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { validate } from "../../../middlewares/validate.middleware.js";

import { createLessonSchema } from "../schemas/lesson.schema.js";

import { updateLessonSchema } from "../schemas/updat-lesson-schema.js";

const router = Router();

const controller = new LessonController();

router.post(
      '/courses/:courseId/lessons',
  authMiddleware,
  validate({ body: createLessonSchema }),
  controller.createLesson,

);



router.get(
  '/courses/:courseId/lessons',
  authMiddleware,
  controller.getCoursLesson,
);

router.get(
  '/lessons/:lessonId',
  authMiddleware,
  controller.getLessonById,
);

router.patch(
  '/lessons/:lessonId',
  authMiddleware,
  validate({
    body: updateLessonSchema,
  }),
  controller.updateLesson,
);

router.delete(
  '/lessons/:lessonId',
  authMiddleware,
  controller.deleteLesson,
);

export default router;