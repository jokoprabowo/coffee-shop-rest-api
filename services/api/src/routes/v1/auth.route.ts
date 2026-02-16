import { Router } from 'express';
import { pool, Database } from '@project/shared';
import { authRateLimiter } from '../../middlewares/rate-limiter';
import { withRateLimiter } from '../../utils/with-rate-limiter';
import { AuthController } from '../../controllers';
import { AuthService, UserService, RefreshTokenService, ProducerService } from '../../services';
import { UserRepository, RefreshTokenRepository, UserTokenRepository } from '../../repositories';
import AuthenticateValidator from '../../validators/authentication';

const db = new Database(pool);

const userRepository = new UserRepository(pool);
const userTokenRepository = new UserTokenRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);

const userService = new UserService(userRepository);
const authService = new AuthService(db, userService, userTokenRepository, ProducerService);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

const authController = new AuthController(authService, refreshTokenService, AuthenticateValidator);
const router = Router();

router.post('/login', withRateLimiter(authRateLimiter), authController.login);
router.post('/register', withRateLimiter(authRateLimiter), authController.register);
router.get('/verify', authController.verifyEmail);
router.post('/forgot-password', withRateLimiter(authRateLimiter), authController.forgotPassword);
router.post('/refresh-token', authController.refreshToken);
router.put('/reset-password', authController.resetPassword);
router.delete('/logout', authController.logout);


export default router;
