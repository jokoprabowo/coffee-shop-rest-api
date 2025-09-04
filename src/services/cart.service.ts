import { NotFoundError } from '../exceptions';
import { CartRepository } from '../repositories';

class CartService {
  private readonly repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  public async addToCart(userId: number, coffeeId: number, quantity: number) {
    let cart = await this.repository.isCartExist(userId);
    let cartId;
    if (!cart) {
      cart = await this.repository.create(userId);
      cartId = cart.id;
    }
    cartId = cart.id;

    await this.repository.createItem(cartId, coffeeId, quantity);
    const cartItems = await this.repository.getCartItems(userId);
    return cartItems;
  }

  public async getCartItems(userId: number) {
    const cartItems = await this.repository.getCartItems(userId);
    if (!cartItems) {
      return [];
    }
    return cartItems;
  }

  public async updateItem(cartItemId: number, quantity: number) {
    const item = await this.repository.updateItem(cartItemId, quantity);
    if (!item) {
      throw new NotFoundError('Cart item not found!');
    }
    return item;
  }

  public async deleteItem(cartItemId: number) {
    const item = await this.repository.deleteItem(cartItemId);
    if (!item) {
      throw new NotFoundError('Cart item not found!');
    }
    return item;
  }
}

export default CartService;
