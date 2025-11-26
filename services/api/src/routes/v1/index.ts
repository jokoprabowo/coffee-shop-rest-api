import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import coffeeRouter from './coffee.route';
import CartRouter from './cart.route';
import OrderRouter from './order.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/coffees', coffeeRouter);
router.use('/carts', CartRouter);
router.use('/orders', OrderRouter);

export default router;
