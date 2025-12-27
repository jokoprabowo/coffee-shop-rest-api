import { NextFunction, Request, Response } from 'express';
import { AuthorizationError } from '../exceptions';
import AuthenticateValidator from '../validators/authentication';
import { RefreshTokenService, AuthService } from '../services';
import { generateAccessToken } from '../utilities/token';
import config from '../config';

class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly token: RefreshTokenService,
    private readonly validator: typeof AuthenticateValidator,
  ) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.validator.validateRegisterPayload(req.body);
      const {
        fullname, address, phone, email, password, role
      } = req.body;

      const user = await this.service.register({
        fullname, address, phone, email, password, role
      });
      delete user.password;
      const verificationToken = await this.service.createUserToken(user.id, 'email_verification');

      res.status(201).json({
        status: 'CREATED',
        message: 'Account successfully created! Please verify your email to activate your account.',
        data: {
          user,
          ...(config.NODE_ENV !== 'production' && { verificationToken }),
        }
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.validator.validateLoginPayload(req.body);
      const {
        email, password, deviceInfo, ipAddress
      } = req.body;
      const user = await this.service.login({ email, password });
      delete user.password;

      if (!user.is_verified) {
        const verificationToken = await this.service.createUserToken(user.id, 'email_verification');
        res.status(403).json({
          status: 'FORBIDDEN',
          message: 'Email is not verified! A new verification email has been sent to your email address.',
          data: {
            user,
            ...(config.NODE_ENV !== 'production' && { verificationToken }),
          }
        });
        return;
      }

      const refreshToken = await this.token.generateToken(user.id, deviceInfo, ipAddress);
      const accessToken = generateAccessToken(user.id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      res.status(200).json({
        status: 'OK',
        message: 'Login successfull!',
        data: {
          user,
          accessToken,
        }
      });
      return;
    } catch(err) {
      next(err);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const user = await this.service.findByEmail(email);
      const resetToken = await this.service.createUserToken(user.id, 'password_reset');

      res.status(200).json({
        status: 'OK',
        message: 'Password reset link sent to your email.',
        ...(config.NODE_ENV !== 'production' && { data: { resetToken } }),
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.query.token as string;
      const { newPassword } = req.body;
      await this.service.resetPassword(token, newPassword);
      res.status(200).json({
        status: 'OK',
        message: 'Password successfully reset!',
      });
    } catch (err) {
      next(err);
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.query.token as string;
      await this.service.verifyToken(token);
      res.status(200).json({
        status: 'OK',
        message: 'Email successfully verified!',
      });
    } catch (err) {
      next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const {
        deviceInfo, ipAddress
      } = req.body;
      const [selector, token] = refreshToken.split('.');
      const userId = await this.token.findUserIdBySelector(selector);
      const verified = await this.token.verifyToken(selector, token);
      if(verified.is_revoked) {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        await this.token.revokeAllTokens(userId);
        throw new AuthorizationError('Refresh token has revoked. Please login again!');
      }

      await this.token.revokeToken(selector);
      const newRefreshToken = await this.token.generateToken(userId, deviceInfo, ipAddress);
      const accessToken = generateAccessToken(req.body.userId);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(200).json({
        status: 'OK',
        message: 'Access token refreshed!',
        data: {
          accessToken,
        },
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const selector = refreshToken.split('.')[0];
      await this.token.revokeToken(selector);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(200).json({
        status: 'OK',
        message: 'Logout successfull!',
      });
      return;
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
