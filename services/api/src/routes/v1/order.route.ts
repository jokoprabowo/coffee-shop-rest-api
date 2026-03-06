import { Router } from 'express';
import { pool, redis, Database } from '@project/shared';
import { midtransSnap } from '../../config/midtrans';
import AuthMiddleware from '../../middlewares/auth.middleware';
import { OrderValidator } from '../../validators';
import { UserRepository, CartRepository, OrderRepository } from '../../repositories';
import { UserService, OrderService, CacheService, ProducerService } from '../../services';
import { OrderController } from '../../controllers';

const db = new Database(pool);

const userRepository = new UserRepository(pool);
const cartRepository = new CartRepository(pool);
const orderRepository = new OrderRepository(pool);

const cacheService = new CacheService(redis);
const userService = new UserService(userRepository);
const orderService = new OrderService(db, orderRepository, userRepository, cartRepository, cacheService, ProducerService, midtransSnap);
const controller = new OrderController(orderService, OrderValidator);

const middleware = new AuthMiddleware(userService);
const router = Router();

router.post('/', middleware.authorize, controller.createOrder);
router.get('/', middleware.authorize, controller.getOrders);
router.get('/stats', middleware.isAdmin, controller.getMonthlyOrderStats);
router.get('/:id', middleware.authorize, controller.getOrderDetails);
router.put('/:id', middleware.authorize, controller.updateOrderStatus);
router.delete('/:id', middleware.authorize, controller.deleteOrder);

export default router;
