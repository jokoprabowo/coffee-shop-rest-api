import { Request, Response } from 'express';
import { AuthorizationError, ConflictError } from '../exceptions';
import AuthService from '../services/auth.service';

class AuthController {
  private service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  public async register(req: Request, res: Response) {
    try {
      const user = await this.service.register(req.body);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'User successfully created!',
        data: {
          user
        }
      });
    } catch (err) {
      if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else if (err instanceof ConflictError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        console.log(err);
        res.status(500).json({
          status: 'INTERNAL_ERROR',
          message: 'Something went wrong!',
        });
      }
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.service.login(email, password);
      delete user.password;

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Login successfull!',
        data: {
          user,
        }
      });
    } catch(err) {
      if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else if (err instanceof ConflictError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        console.log(err);
        res.status(500).json({
          status: 'INTERNAL ERROR',
          message: 'Something went wrong!',
        });
      }
    }
  }
}

export default AuthController;
