import {  Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { validate } from '../../../middlewares/validate.middleware.js';

import { updateUserSchema } from '../schemas/update-user.schema.js';
import { changePasswordSchema } from '../schemas/change-password.schema.js';


const router = Router();
const controller = new UserController();

router.get('/me',authMiddleware,controller.getProfile);
router.patch('/me',authMiddleware,validate({body:updateUserSchema}),controller.updateProfile);
router.delete('/me',authMiddleware,controller.deletedAccount);

router.patch('/me/password',authMiddleware,
    validate({body:changePasswordSchema}),controller.changePassword);

export default router;
