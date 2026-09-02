import { Router } from 'express';
import { ProgressController } from '../controller/progress.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { validate } from '../../../middlewares/validate.middleware.js';

import { updateProgressSchema } from '../schema/update-progress.schema.js';

const router = Router();
const controller = new ProgressController();

router.patch(
  '/lessons/:lessonId/progress',
  authMiddleware,
  validate({
    body: updateProgressSchema,
  }),
  controller.updateLessonProgress,
);


router.get(
  '/lessons/:lessonId/progress',
  authMiddleware,
  controller.getLessonProgress,
);


router.get(
  '/courses/:courseId/progress',
  authMiddleware,
  controller.getCourseProgress,
);


export default router;