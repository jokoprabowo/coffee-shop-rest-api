import { Router } from 'express';
import pool from '../../config/db';
import { AuthController } from '../../controllers';
import { AuthService, UserService } from '../../services';
import { UserRepository } from '../../repositories';

const repository = new UserRepository(pool);
const service = new AuthService(new UserService(repository));
const controller = new AuthController(service);
const router = Router();

router.get('/login', controller.login);
router.post('/register', controller.register);

export default router;
