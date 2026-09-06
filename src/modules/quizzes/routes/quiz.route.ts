import { Router } from "express";
import { QuizController } from "../controllers/quiz.controller.js";
import { authMiddleware } from '../../../middlewares/auth.middleware.js';

import { validate } from '../../../middlewares/validate.middleware.js';

import { createQuizSchema } from '../schemas/create-quiz.schema.js';
import { updateQuizSchema } from '../schemas/update-quiz.schema.js';

const router = Router();
const controller = new QuizController();

router.post(
  "/lessons/:lessonId/quiz",
  authMiddleware,
  validate({ body: createQuizSchema }),
  controller.createQuiz,
);

router.patch(
  "/quizzes/:quizId",
  authMiddleware,
  validate({ body: updateQuizSchema }),
  controller.updateQuiz,
);

router.delete(
  "/quizzes/:quizId",
  authMiddleware,
  controller.deleteQuiz,
);

/*
 * Read
 */

router.get(
  "/quizzes/:quizId",
  authMiddleware,
  controller.getQuizById,
);

router.get(
  "/lessons/:lessonId/quiz",
  authMiddleware,
  controller.getQuizByLessonId,
);

export default router;