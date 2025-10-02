import { Request, Response, NextFunction } from 'express';
import { CoffeeService } from '../services';
import CoffeeValidator from '../validators/coffee';

class CoffeeController {
  private readonly service: CoffeeService;
  private readonly validator: typeof CoffeeValidator;

  constructor(service: CoffeeService, validator: typeof CoffeeValidator) {
    this.service = service;
    this.validator = validator;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      this.validator.validatePostCoffeePayload(req.body);
      const coffee = await this.service.create(req.body);
      return res.status(201).json({
        status: 'CREATED',
        message: 'Coffee has been created!',
        data: {
          coffee,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const coffees = await this.service.findAll();
      return res.status(200).json({
        status: 'OK',
        message: 'Coffees have been retrieved!',
        data: {
          coffees,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const coffee = await this.service.findOne(req.params.id);
      return res.status(200).json({
        status: 'OK',
        message: 'Coffee has been retrieved!',
        data: {
          coffee,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      this.validator.validatePutCoffeePayload(req.body);
      const coffee = await this.service.update(req.params.id, req.body);
      return res.status(200).json({
        status: 'OK',
        message: 'Coffee has been updated!',
        data: {
          coffee,
        }
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.delete(req.params.id);
      return res.status(200).json({
        status: 'OK',
        message: 'Coffee has been deleted!',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default CoffeeController;
