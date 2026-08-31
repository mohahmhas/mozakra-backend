import { Router } from 'express';
import { authRouter } from '../modules/auth/index.js';
import { sessionRouter } from '../modules/auth/index.js';
import { userRouter } from '../modules/users/index.js';
import { courseRouter } from '../modules/courses/index.js';
import { lessonRouter } from '../modules/lessons/index.js';
import { enrollmentRouter } from '../modules/enrollments/index.js';


const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/sessions', sessionRouter);

apiRouter.use('/users', userRouter);

apiRouter.use('/courses', courseRouter);

apiRouter.use('/', lessonRouter);
apiRouter.use('/',enrollmentRouter);


export default apiRouter;