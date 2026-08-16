import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { registerSchema } from "../schemas/register.schema.js";
import { loginSchema } from "../schemas/login.schema.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = Router();
const controller = new AuthController();
const sessioonController = new AuthController();

router.get('/session',);

router.post(

    '/logout',

    controller.logout,

);

router.post(

    '/refresh-token',

    controller.refresh,

);

router.get('/me',authMiddleware ,controller.me);
   

router.post(
    '/register',
    validate({body:registerSchema}),
    controller.register
);

router.post(
    '/login',
       validate({
        body: loginSchema,
    }),

    controller.login
);


export default router;