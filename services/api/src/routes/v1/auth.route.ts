import { Router } from 'express';
import { pool } from '@project/shared';
import { rateLimiter } from '../../middlewares/rate-limiter';
import { withRateLimiter } from '../../utilities/with-rate-limiter';
import { AuthController } from '../../controllers';
import { AuthService, UserService, RefreshTokenService, ProducerService } from '../../services';
import { UserRepository, RefreshTokenRepository, UserTokenRepository } from '../../repositories';
import AuthenticateValidator from '../../validators/authentication';

const userRepository = new UserRepository(pool);
const userTokenRepository = new UserTokenRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);

const userService = new UserService(userRepository);
const authService = new AuthService(userService, userTokenRepository, ProducerService);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

const authController = new AuthController(authService, refreshTokenService, AuthenticateValidator);
const router = Router();

router.post('/login', withRateLimiter(() => rateLimiter(5)), authController.login);
router.post('/register', withRateLimiter(() => rateLimiter(5)), authController.register);
router.get('/verify', authController.verifyEmail);
router.post('/forgot-password', withRateLimiter(() => rateLimiter(5)), authController.forgotPassword);
router.post('/refresh-token', authController.refreshToken);
router.put('/reset-password', authController.resetPassword);
router.delete('/logout', authController.logout);


export default router;
