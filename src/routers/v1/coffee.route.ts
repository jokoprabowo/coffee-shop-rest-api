import { Router } from 'express';
import pool from '../../config/db';
import { CoffeeRepository } from '../../repositories';
import { CoffeeService } from '../../services';
import CoffeeValidator from '../../validators/coffee';
import { CoffeeController } from '../../controllers';

const repository = new CoffeeRepository(pool);
const service = new CoffeeService(repository);
const controller = new CoffeeController(service, CoffeeValidator);
const router = Router();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.updateById);
router.delete('/:id', controller.deleteById);

export default router;
