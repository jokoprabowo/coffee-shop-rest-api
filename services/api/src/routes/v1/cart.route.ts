import { Router } from 'express';
import { pool, redis, Database } from '@project/shared';
import { CartValidator } from '../../validators';
import { CartRepository, UserRepository, CoffeeRepository } from '../../repositories';
import { CartService, UserService, CacheService } from '../../services';
import { CartController } from '../../controllers';
import AuthMiddleware from '../../middlewares/auth.middleware';

const db = new Database(pool);

const userRepository = new UserRepository(pool);
const cartRepository = new CartRepository(pool);
const coffeeRepository = new CoffeeRepository(pool);

const cacheService = new CacheService(redis);
const userService = new UserService(userRepository);
const cartService = new CartService(db, cartRepository, coffeeRepository, cacheService);

const cartController = new CartController(cartService, CartValidator);
const middleware = new AuthMiddleware(userService);
const router = Router();

router.post('/', middleware.authorize, cartController.addToCart);
router.get('/', middleware.authorize, cartController.getCartItems);
router.put('/', middleware.authorize, cartController.updateItem);
router.delete('/', middleware.authorize, cartController.deleteItem);

export default router;
