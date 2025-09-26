import { NextFunction, Request, Response } from 'express';
import { AuthorizationError, ClientError } from '../exceptions';
import AuthenticateValidator from '../validators/authentication';
import { RefreshTokenService, AuthService } from '../services';
import { generateAccessToken } from '../utilities/token';

class AuthController {
  private readonly service: AuthService;
  private readonly token: RefreshTokenService;
  private readonly validator: typeof AuthenticateValidator;

  constructor(service: AuthService, token: RefreshTokenService, validator: typeof AuthenticateValidator) {
    this.service = service;
    this.validator = validator;
    this.token = token;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      this.validator.validateRegisterPayload(req.body);
      const {
        fullname, address, phone, email, password, role, deviceInfo, ipAddress
      } = req.body;

      const user = await this.service.register({
        fullname, address, phone, email, password, role
      });

      const refreshToken = await this.token.generateToken(user.id, deviceInfo, ipAddress);
      const accessToken = generateAccessToken(user.id);
      delete user.password;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(201).json({
        status: 'CREATED',
        message: 'User successfully created!',
        data: {
          user,
          accessToken,
        }
      });
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      this.validator.validateLoginPayload(req.body);
      const {
        email, password, deviceInfo, ipAddress
      } = req.body;
      const user = await this.service.login({ email, password });

      const refreshToken = await this.token.generateToken(user.id, deviceInfo, ipAddress);
      const accessToken = generateAccessToken(user.id);
      delete user.password;

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
    } catch(err) {
      next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const {
        deviceInfo, ipAddress
      } = req.body;
      const [selector, token] = refreshToken.split('.');
      const userId = await this.token.findUserIdBySelector(selector);
      const verified = await this.token.verifyToken(selector, token);
      if (!verified) {
        throw new ClientError('Invalid refresh token!');
      }

      if(verified.is_revoked) {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        await this.token.revokeAllTokens(userId);
        throw new AuthorizationError('Refresh token has been revoked. Please login again!');
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
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
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
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
