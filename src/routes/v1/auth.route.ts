import { Router } from 'express';
import pool from '../../config/db';
import { AuthController } from '../../controllers';
import { AuthService, UserService, RefreshTokenService } from '../../services';
import { UserRepository, RefreshTokenRepository } from '../../repositories';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import AuthenticateValidator from '../../validators/authentication';

const repository = new UserRepository(pool);
const service = new AuthService(new UserService(repository));
const controller = new AuthController(service, new RefreshTokenService(new RefreshTokenRepository(pool)), AuthenticateValidator);
const middleware = new AuthMiddleware(new UserService(repository));
const router = Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/refresh-token', middleware.authorize, controller.refreshToken);
router.delete('/logout', middleware.authorize, controller.logout);


export default router;
