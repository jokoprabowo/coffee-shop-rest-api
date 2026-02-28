import { NextFunction, Request, Response } from 'express';
import { OrderService } from '../services';
import { AuthenticationError } from '../exceptions';
import { OrderValidator } from '../validators';

class OrderController {
  constructor(
    private readonly service: OrderService,
    private readonly validator: typeof OrderValidator,
  ) {
    this.createOrder = this.createOrder.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.getOrderDetails = this.getOrderDetails.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.getMonthlyOrderStats = this.getMonthlyOrderStats.bind(this);
  }

  public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const order = await this.service.createOrder(req.userId);
      const transaction = await this.service.createTransaction(req.userId, order.id);

      res.status(201).json({
        status: 'CREATED',
        message: 'Order has been created!',
        data: {
          order,
          transaction,
        }
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const orders = await this.service.getOrderList(req.userId);
      res.status(200).json({
        status: 'OK',
        message: 'Orders have been retrieved!',
        data: {
          orders,
        }
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async getOrderDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.validator.validateGetOrderDetails({ id: Number(req.params.id) });
      const orders = await this.service.getOrderDetails(Number(req.params.id));
      res.status(200).json({
        status: 'OK',
        message: 'Order have been retrieved!',
        data: {
          orders,
        }
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.validator.validatePutOrderStatus({ id: Number(req.params.id), status: req.body.status });
      await this.service.updateStatus(Number(req.params.id), req.body.status);
      res.status(200).json({
        status: 'OK',
        message: 'Order status have been updated!',
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.validator.validateDelOrder({ id: Number(req.params.id) });
      await this.service.deleteOrder(Number(req.params.id));
      res.status(200).json({
        status: 'OK',
        message: 'Order status have been deleted!',
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async getMonthlyOrderStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const month = Number(req.query.month);
      const year = Number(req.query.year);
      const statuses = req.query.statuses ? (req.query.statuses as string).split(',') : [];
      this.validator.validateGetMonthlyOrderStats({ month, year, statuses });
      const orderStats = await this.service.getMonthlyOrderStats(month, year, statuses);
      res.status(200).json({
        status: 'OK',
        message: 'Monthly order stats have been retrieved!',
        data: {
          orderStats,
        },
      });
      return;
    }  catch (err) {
      next(err);
    }
  }
}

export default OrderController;
