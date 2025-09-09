import { Router } from 'express';
import pool from '../../config/db';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRepository, CartRepository, OrderRepository } from '../../repositories';
import { UserService, OrderService } from '../../services';
import { OrderController } from '../../controllers';

const middleware = new AuthMiddleware(new UserService(new UserRepository(pool)));
const repository = new OrderRepository(pool);
const service = new OrderService(repository, new CartRepository(pool));
const controller = new OrderController(service);
const router = Router();

router.post('/', middleware.authorize, controller.createOrder);
router.get('/all', middleware.authorize, controller.getOrders);
router.get('/detail', middleware.authorize, controller.getOrderDetails);
router.put('/', middleware.authorize, controller.updateOrderStatus);
router.delete('/', middleware.authorize, controller.deleteOrder);

export default router;
