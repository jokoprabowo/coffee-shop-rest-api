import { Router } from 'express';
import pool from '../../config/db';
import { CoffeeRepository, UserRepository } from '../../repositories';
import { CoffeeService, UserService } from '../../services';
import CoffeeValidator from '../../validators/coffee';
import { CoffeeController } from '../../controllers';
import AuthMiddleware from '../../middlewares/authorization';

const repository = new CoffeeRepository(pool);
const service = new CoffeeService(repository);
const controller = new CoffeeController(service, CoffeeValidator);
const middleware = new AuthMiddleware(new UserService(new UserRepository(pool)));
const router = Router();

router.post('/', middleware.isAdmin, controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', middleware.isAdmin, controller.updateById);
router.delete('/:id', middleware.isAdmin, controller.deleteById);

export default router;
