    import { Router } from 'express';
    import { authRouter } from '../modules/auth/index.js';
    import { sessionRouter } from '../modules/auth/index.js';
    import { userRouter } from '../modules/users/index.js';
    import { courseRouter } from '../modules/courses/index.js';

    const apiRouter = Router();

    apiRouter.use('/auth',authRouter);
    apiRouter.use('/sessions',sessionRouter);

    apiRouter.use('/users',userRouter);

    apiRouter.use('/courses',courseRouter);


    export default apiRouter;