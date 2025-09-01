import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';
import { verifyAccessToken } from '../utilities/token';
import { AuthenticationError } from '../exceptions';

class AuthMiddleware {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.authorize = this.authorize.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
  }

  public async authorize (req: Request, res: Response, next: NextFunction) {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        throw new AuthenticationError('Access token is missing!');
      }
      const token = bearerToken.split('Bearer ')[1];
      const tokenPayload = verifyAccessToken(token) as {userId: number};
      req.userId = tokenPayload.userId;
      next();
    } catch (err) {
      next(err);
    }
  }

  public async isAdmin (req: Request, res: Response, next: NextFunction) {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        throw new AuthenticationError('Access token is missing!');
      }

      const token = bearerToken.split('Bearer ')[1];
      const tokenPayload = verifyAccessToken(token) as {userId: number};
      await this.userService.verifyAdmin(tokenPayload.userId);
      next();
    } catch (err) {
      next(err);
    }
  }
}

export default AuthMiddleware;
