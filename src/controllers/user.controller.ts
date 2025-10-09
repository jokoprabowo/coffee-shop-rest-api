import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';
import { AuthenticationError } from '../exceptions';
import UserValidator from '../validators/user';

class UserController {
  private readonly service: UserService;
  private readonly validator: typeof UserValidator;

  constructor(service: UserService, validator: typeof UserValidator) {
    this.service = service;
    this.validator = validator;
    this.getUserDetails = this.getUserDetails.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  public async getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AuthenticationError('Authentication required!');
      }
      const user = await this.service.findById(req.userId);
      delete user.password;
      res.status(200).json({
        status: 'OK',
        message: 'User details have been retrieved!',
        data: {
          user,
        }
      });
      return;
    } catch(err) {
      next(err);
    }
  }

  public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.service.findAll();
      res.status(200).json({
        status: 'OK',
        message: 'Users data have been retrieved!',
        data: {
          users,
        }
      });
      return;
    } catch(err) {
      next(err);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.validator.validatePutPayload(req.body);
      const {
        password, fullname, address, phone
      } = req.body;
      if (!req.userId) {
        throw new AuthenticationError('Authentication required!');
      }

      const user = await this.service.update(req.userId, { password, fullname, address, phone });
      res.status(200).json({
        status: 'OK',
        message: 'User details have been updated!',
        data: {
          user,
        },
      });
      return;
    } catch(err) {
      next(err);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AuthenticationError('Authentication required!');
      }
      await this.service.delete(req.userId);
      res.status(200).json({
        status: 'OK',
        message: 'User has been deleted!',
      });
      return;
    } catch(err) {
      next(err);
    }
  }
}

export default UserController;
