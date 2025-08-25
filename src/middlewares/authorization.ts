import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken } from '../utilities/token';
import { AuthenticationError } from '../exceptions';
import { UserService } from '../services';

class AuthMiddleware {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async authorize(req: Request, res: Response, next: NextFunction) {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        throw new AuthenticationError('Access token is missing!');
      }
      const token = bearerToken.split('Bearer ')[1];
      const tokenPayload = verifyAccessToken(token) as {email: string};

      req.user = await this.userService.findOne(tokenPayload.email);
      next();
    } catch (err) {
      if (err instanceof AuthenticationError) {
        res.status(err.statusCode).json({
          message: err.message,
          status: err.status,
        });
      }
    }
  }

  public async cookiesAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const cookie = req.headers.cookie;
      if (!cookie) {
        throw new AuthenticationError('Refresh token is missing!');
      } 
      const token = cookie.split('=')[1];
      const user = verifyRefreshToken(token) as {user: object};
      req.user = user;
      next();
    } catch (err) {
      if (err instanceof AuthenticationError) {
        res.clearCookie('token');
        res.status(401).json({
          status: 'Unauthorized!',
          message: err.message,
        });
      }
    }
  }
}

export default AuthMiddleware;
