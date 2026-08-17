    import { Router } from 'express';
    import { authRouter } from '../modules/auth/index.js';
    import { sessionRouter } from '../modules/auth/index.js';

    const apiRouter = Router();

    apiRouter.use('/auth',authRouter);
    apiRouter.use('/sessions',sessionRouter);

    export default apiRouter;