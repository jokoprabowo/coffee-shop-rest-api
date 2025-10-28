import express from 'express';
import pool from '../../config/db';
import { CartRepository, UserRepository, CoffeeRepository } from '../../repositories';
import { CartService, UserService, CacheService } from '../../services';
import { CartController } from '../../controllers';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();

const userRepository = new UserRepository(pool);
const cartRepository = new CartRepository(pool);
const coffeeRepository = new CoffeeRepository(pool);

const cacheService = new CacheService();
const userService = new UserService(userRepository);
const cartService = new CartService(cartRepository, cacheService, coffeeRepository);

const cartController = new CartController(cartService);
const middleware = new AuthMiddleware(userService);

router.post('/', middleware.authorize, cartController.addToCart);
router.get('/', middleware.authorize, cartController.getCartItems);
router.put('/', middleware.authorize, cartController.updateItem);
router.delete('/', middleware.authorize, cartController.deleteItem);

export default router;
