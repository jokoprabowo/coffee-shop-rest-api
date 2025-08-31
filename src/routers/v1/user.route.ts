import { Router } from 'express';
import pool from '../../config/db';
import { UserController } from '../../controllers';
import { UserService } from '../../services';
import { UserRepository } from '../../repositories';
import AuthMiddleware from '../../middlewares/authorization';
import UserValidator from '../../validators/user';

const repository = new UserRepository(pool);
const service = new UserService(repository);
const controller = new UserController(service, UserValidator);
const middleware = new AuthMiddleware(service);
const router = Router();

router.get('/all', middleware.isAdmin, controller.getAllUsers);
router.get('/profile', middleware.authorize, controller.getUserDetails);
router.put('/update', middleware.authorize, controller.updateUser);
router.delete('/delete', middleware.authorize, controller.deleteUser);

export default router;
