import express from 'express';
import pool from '../../config/db';
import { CartRepository, UserRepository } from '../../repositories';
import { CartService, UserService } from '../../services';
import { CartController } from '../../controllers';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();
const repository = new CartRepository(pool);
const service = new CartService(repository);
const controller = new CartController(service);
const middleware = new AuthMiddleware(new UserService(new UserRepository(pool)));

router.post('/', middleware.authorize, controller.addToCart);
router.get('/', middleware.authorize, controller.getCartItems);
router.put('/', middleware.authorize, controller.updateItem);
router.delete('/', middleware.authorize, controller.deleteItem);

export default router;
