import { Request, Response } from 'express';
import { CoffeeService } from '../services';
import CoffeeValidator from '../validators/coffee';
import { NotFoundError, AuthorizationError } from '../exceptions';

class CoffeeController {
  private service: CoffeeService;
  private validator: typeof CoffeeValidator;

  constructor(service: CoffeeService, validator: typeof CoffeeValidator) {
    this.service = service;
    this.validator = validator;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  public async create(req: Request, res: Response) {
    try {
      this.validator.validatePostCoffeePayload(req.body);
      const coffee = await this.service.create(req.body);
      res.status(201).json({
        status: 'CREATED',
        data: {
          coffee,
        },
      });
    } catch (err) {
      if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        console.log(err);
        res.status(500).json({
          status: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong!'
        });
      }
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const coffees = await this.service.findAll();
      res.status(200).json({
        status: 'OK',
        message: 'Coffees have been retrieved!',
        data: {
          coffees,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong!'
      });
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const coffee = await this.service.findOne(req.params.id);
      res.status(200).json({
        status: 'OK',
        message: 'Coffee has been retrieved!',
        data: {
          coffee,
        },
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        console.log(err);
        res.status(500).json({
          status: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong!'
        });
      }
    }
  }

  public async updateById(req: Request, res: Response) {
    try {
      this.validator.validatePutCoffeePayload(req.body);
      const coffee = await this.service.update(req.params.id, req.body);
      res.status(200).json({
        status: 'OK',
        message: 'Coffee has been updated!',
        data: {
          coffee,
        },
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        console.log(err);
        res.status(500).json({
          status: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong!'
        });
      }
    }
  }

  public async deleteById(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id);
      res.status(200).json({
        status: 'OK',
        message: 'Coffee has been deleted!',
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        console.log(err);
        res.status(500).json({
          status: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong!'
        });
      }
    }
  }
}

export default CoffeeController;
