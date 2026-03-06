import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import coffeeRouter from './coffee.route';
import cartRouter from './cart.route';
import orderRouter from './order.route';
import paymentRouter from './payment.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/coffees', coffeeRouter);
router.use('/carts', cartRouter);
router.use('/orders', orderRouter);
router.use('/payments', paymentRouter);

export default router;
