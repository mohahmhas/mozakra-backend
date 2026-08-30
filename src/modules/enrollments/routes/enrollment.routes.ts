import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";


const router = Router();
const controller = new EnrollmentController();


 // Get current user's enrollments
 
router.get(
  '/',
  authMiddleware,
  controller.getMyEnrollments,
);



 // Enroll in course
 
router.post(
  '/courses/:courseId/enroll',
  authMiddleware,
  controller.enroll,
);



 // Get enrollment for specific course
 
router.get(
  '/courses/:courseId/enrollment',
  authMiddleware,
  controller.getEnrollment,
);



 // Unenroll from course
 
router.delete(
  '/courses/:courseId/enroll',
  authMiddleware,
  controller.unenroll,
);


export default router;