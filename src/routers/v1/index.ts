import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import coffeeRouter from './coffee.route';
import CartRouter from './cart.route';
import OrderRouter from './order.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/coffee', coffeeRouter);
router.use('/cart', CartRouter);
router.use('/order', OrderRouter);

export default router;
