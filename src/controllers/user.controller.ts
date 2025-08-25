import { Request, Response } from 'express';
import { UserService } from '../services';
import { NotFoundError } from '../exceptions';

class UserController {
  private service: UserService;

  constructor(service: UserService) {
    this.service = service;
    this.getUserDetails = this.getUserDetails.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  public async getUserDetails(req: Request, res: Response) {
    try {
      const user = await this.service.findOne(req.body.email);
      delete user?.password;
      res.status(200).json({
        status: 'OK',
        message: 'User details have been retrieved!',
        data: {
          user,
        }
      });
    } catch(err) {
      if (err instanceof NotFoundError) {
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

  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.service.findAll();
      res.status(200).json({
        status: 'OK',
        message: 'Users data have been retrieved!',
        data: {
          users,
        }
      });
    } catch(err) {
      console.log(err);
      res.status(500).json({
        status: 'INTERNAL_ERROR',
        message: 'Something went wrong!',
      });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const {
        email, password, fullname, address, phone
      } = req.body;

      const user = await this.service.update(email, { password, fullname, address, phone });
      res.status(200).json({
        status: 'OK',
        message: 'User details have been updated!',
        data: {
          user,
        }
      });
    } catch(err) {
      if (err instanceof NotFoundError) {
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

  public async deleteUser(req: Request, res: Response) {
    try {
      const user = await this.service.delete(req.body.email);
      res.status(200).json({
        status: 'OK',
        message: 'User have been deleted!',
        data: {
          user,
        }
      });
    } catch(err) {
      if (err instanceof NotFoundError) {
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
}

export default UserController;
