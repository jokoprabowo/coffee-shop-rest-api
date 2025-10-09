import { NextFunction, Request, Response } from 'express';
import { CartService } from '../services';
import { AuthenticationError } from '../exceptions';

class CartController {
  private readonly service: CartService;

  constructor(service: CartService) {
    this.service = service;
    this.addToCart = this.addToCart.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  public async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { coffeeId, quantity } = req.body;
      if(!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const cartItems = await this.service.addToCart(req.userId, coffeeId, quantity);
      res.status(201).json({
        status: 'CREATED',
        message: 'Cart item has been added!',
        data: {
          cartItems,
        },
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async getCartItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const result = await this.service.getCartItems(req.userId);
      res.set('X-Data-Source', result.source);
      res.status(200).json({
        status: 'OK',
        message: 'Cart items have been retrieved!',
        data: {
          cartItems: result.cartItems,
        },
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const { cartItemId, quantity } = req.body;
      await this.service.updateItem(req.userId, cartItemId, quantity);
      res.status(200).json({
        status: 'OK',
        message: 'Cart items has been updated!',
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  public async deleteItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const { cartItemId } = req.body;
      await this.service.deleteItem(req.userId, cartItemId);
      res.status(200).json({
        status: 'OK',
        message: 'Cart items has been deleted!',
      });
      return;
    } catch (err) {
      next(err);
    }
  }
}

export default CartController;
