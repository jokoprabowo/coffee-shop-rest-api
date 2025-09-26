import { Router } from 'express';
import pool from '../../config/db';
import { AuthController } from '../../controllers';
import { AuthService, UserService, RefreshTokenService } from '../../services';
import { UserRepository, RefreshTokenRepository } from '../../repositories';
import AuthenticateValidator from '../../validators/authentication';

const repository = new UserRepository(pool);
const service = new AuthService(new UserService(repository));
const controller = new AuthController(service, new RefreshTokenService(new RefreshTokenRepository(pool)), AuthenticateValidator);
const router = Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/refresh-token', controller.refreshToken);
router.delete('/logout', controller.logout);


export default router;
