    import { Router } from 'express';
    import { authRouter } from '../modules/auth/index.js';


    const apiRouter = Router();

    apiRouter.use('/auth',authRouter);

    export default apiRouter;