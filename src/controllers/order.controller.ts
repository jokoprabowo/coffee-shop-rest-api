import { NextFunction, Request, Response } from 'express';
import { OrderService } from '../services';
import { AuthenticationError } from '../exceptions';

class OrderController {
  private readonly service: OrderService;

  constructor(service: OrderService) {
    this.service = service;
    this.createOrder = this.createOrder.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.getOrderDetails = this.getOrderDetails.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  public async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const order = await this.service.createOrder(req.userId);

      return res.status(201).json({
        status: 'CREATED',
        message: 'Order has been created!',
        data: {
          order,
        }
      });
    } catch (err) {
      next(err);
    }
  }

  public async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const orders = await this.service.getOrderList(req.userId);
      return res.status(200).json({
        status: 'OK',
        message: 'Orders have been retrieved!',
        data: {
          orders,
        }
      });
    } catch (err) {
      next(err);
    }
  }

  public async getOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await this.service.getOrderDetails(Number(req.params.id));
      return res.status(200).json({
        status: 'OK',
        message: 'Order have been retrieved!',
        data: {
          orders,
        }
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.updateStatus(Number(req.params.id), req.body.status);
      return res.status(200).json({
        status: 'OK',
        message: 'Order status have been updated!',
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.deleteOrder(Number(req.params.id));
      return res.status(200).json({
        status: 'OK',
        message: 'Order status have been deleted!',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default OrderController;
