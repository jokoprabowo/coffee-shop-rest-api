import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import coffeeRouter from './coffee.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/coffee', coffeeRouter);

export default router;
