import { Router } from 'express';
import pool from '../../config/db';
import { UserController } from '../../controllers';
import { UserService } from '../../services';
import { UserRepository } from '../../repositories';
import UserValidator from '../../validators/user';

const repository = new UserRepository(pool);
const service = new UserService(repository);
const controller = new UserController(service, UserValidator);
const router = Router();

router.get('/all', controller.getAllUsers);
router.get('/profile', controller.getUserDetails);
router.put('/update', controller.updateUser);
router.delete('/delete', controller.deleteUser);

export default router;
