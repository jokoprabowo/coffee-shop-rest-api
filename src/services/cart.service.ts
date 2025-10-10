import crypto from 'crypto';
import { NotFoundError } from '../exceptions';
import { CartRepository, CoffeeRepository } from '../repositories';
import { CacheService } from './';
import { CartItemDTO } from '../dto';

interface CartItemResponse {
  cartItems: CartItemDTO[],
  source: string,
}

class CartService {
  private readonly repository: CartRepository;
  private readonly coffeeRepository: CoffeeRepository;
  private readonly cacheService: CacheService;

  constructor(repository: CartRepository, cacheService: CacheService, coffeeRepository: CoffeeRepository) {
    this.repository = repository;
    this.cacheService = cacheService;
    this.coffeeRepository = coffeeRepository;
  }

  public async addToCart(userId: number, coffeeId: number, quantity: number): Promise<CartItemDTO[]> {
    const coffee = await this.coffeeRepository.findOne(coffeeId);
    if (!coffee) {
      throw new NotFoundError('Coffee not found!');
    }
    const cartItemId = crypto.randomBytes(32).toString('hex');

    const cart = await this.cacheService.get(`cart:${userId}`);
    if (cart) {
      const cartItems: CartItemDTO[] = JSON.parse(cart);
      const data = cartItems.find(item => item.coffee_id === coffee.id);
      if (data) {
        data.quantity += quantity;
        data.total_price = coffee.price * data.quantity;
        data.updated_at = new Date().toString();
        await this.cacheService.set(`cart:${userId}`, JSON.stringify(cartItems));
        return cartItems;
      }

      const cartItem = {
        cart_item_id: cartItemId,
        coffee_id: coffeeId,
        name: coffee.name,
        price: coffee.price,
        quantity,
        total_price: (coffee.price * quantity),
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
      };
      cartItems.push(cartItem);
      await this.cacheService.set(`cart:${userId}`, JSON.stringify(cartItems));
      return cartItems;
    }

    const cartItem = {
      cart_item_id: cartItemId,
      coffee_id: coffeeId,
      name: coffee.name,
      price: coffee.price,
      quantity,
      total_price: (coffee.price * quantity),
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
    };
    const cartItems = [cartItem];
    await this.cacheService.set(`cart:${userId}`, JSON.stringify(cartItems));
    return cartItems;
  }

  public async getCartItems(userId: number): Promise<CartItemResponse> {
    const cart = await this.cacheService.get(`cart:${userId}`);
    if (cart) {
      const cartItems = JSON.parse(cart);
      return {
        cartItems,
        source: 'cache',
      };
    }

    const cartItems = await this.repository.getCartItems(userId);
    return {
      cartItems,
      source: 'database',
    };
  }

  public async updateItem(userId: number, cartItemId: number|string, quantity: number): Promise<boolean> {
    const cart = await this.cacheService.get(`cart:${userId}`);
    if (cart) {
      const cartItems: CartItemDTO[] = JSON.parse(cart);
      const cartItem = cartItems.find(item => item.cart_item_id === cartItemId);
      if (cartItem) {
        cartItem.quantity = quantity;
        cartItem.updated_at = new Date().toString();
        await this.cacheService.set(`cart:${userId}`, JSON.stringify(cartItems));
        return true;
      } else {
        throw new NotFoundError('Cart item not found!');
      }
    }

    const item = await this.repository.updateItem(Number(cartItemId), quantity);
    if (!item) {
      throw new NotFoundError('Cart item not found!');
    }

    return item;
  }

  public async deleteItem(userId: number, cartItemId: number|string): Promise<boolean> {
    const cart = await this.cacheService.get(`cart:${userId}`);
    if (cart) {
      const cartItems: CartItemDTO[] = JSON.parse(cart);
      const updatedCartItems = cartItems.filter(item => item.cart_item_id !== cartItemId);
      await this.cacheService.set(`cart:${userId}`, JSON.stringify(updatedCartItems));
      return true;
    }

    const item = await this.repository.deleteItem(Number(cartItemId));
    if (!item) {
      throw new NotFoundError('Cart item not found!');
    }
    return item;
  }
}

export default CartService;
