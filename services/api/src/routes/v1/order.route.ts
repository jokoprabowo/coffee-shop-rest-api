import { Router } from 'express';
import { pool } from '@project/shared';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRepository, CartRepository, OrderRepository } from '../../repositories';
import { UserService, OrderService, CacheService, ProducerService } from '../../services';
import { OrderController } from '../../controllers';

const userRepository = new UserRepository(pool);
const cartRepository = new CartRepository(pool);
const orderRepository = new OrderRepository(pool);

const cacheService = new CacheService();
const userService = new UserService(userRepository);
const orderService = new OrderService(orderRepository, cartRepository, cacheService, ProducerService);
const controller = new OrderController(orderService);

const middleware = new AuthMiddleware(userService);
const router = Router();

router.post('/', middleware.authorize, controller.createOrder);
router.get('/', middleware.authorize, controller.getOrders);
router.get('/:id', middleware.authorize, controller.getOrderDetails);
router.put('/:id', middleware.authorize, controller.updateOrderStatus);
router.delete('/:id', middleware.authorize, controller.deleteOrder);

export default router;
