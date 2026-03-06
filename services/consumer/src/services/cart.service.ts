import { CartDTO, CartItemDTO } from '../dto/cart.dto';
import { CartRepository } from '../repositories';

class CartService {
  constructor(private readonly repository: CartRepository) {}

  public async addToCart(cartId:number, coffeeId: number, quantity: number): Promise<CartItemDTO> {
    const cartItem = await this.repository.insertIntoCartItem(cartId, coffeeId, quantity);
    return cartItem;
  }

  public async isCartExist(userId: number): Promise<Pick<CartDTO, 'id'> | null> {
    const cart = await this.repository.isCartExist(userId);
    return cart;
  }

  public async createCart(userId: number): Promise<Pick<CartDTO, 'id'>> {
    const cart = await this.repository.createCart(userId);
    return cart;
  }

  public async updateCartStatus(cartId: number): Promise<boolean> {
    const cart = await this.repository.updateCartStatus(cartId);
    return cart;
  }

  public async deleteCart(): Promise<boolean> {
    const cart = await this.repository.deleteCart();
    return cart;
  }
}

export default CartService;
