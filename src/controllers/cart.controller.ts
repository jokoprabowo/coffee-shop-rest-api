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

  public async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { coffeeId, quantity } = req.body;
      if(!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const cartItems = await this.service.addToCart(req.userId, coffeeId, quantity);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Cart item has been added!',
        data: {
          cartItems,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async getCartItems(req: Request, res: Response, next: NextFunction) {
    try {
      if(!req.userId) {
        throw new AuthenticationError('Login required!');
      }
      const cartItems = await this.service.getCartItems(req.userId);
      res.status(200).json({
        status: 'OK',
        message: 'Cart items have been retrieved!',
        data: {
          cartItems,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartItemId, quantity } = req.body;
      await this.service.updateItem(cartItemId, quantity);
      res.status(200).json({
        status: 'OK',
        message: 'Cart items has been updated!',
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartItemId } = req.body;
      await this.service.deleteItem(cartItemId);
      res.status(200).json({
        status: 'OK',
        message: 'Cart items has been deleted!',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default CartController;
