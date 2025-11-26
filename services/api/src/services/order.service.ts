import { CartRepository, OrderRepository } from '../repositories';
import { CacheService, ProducerService } from '.';
import { NotFoundError } from '../exceptions';
import { CartItemDTO, OrderDTO, OrderItemDTO } from '../dto';

class OrderService {
  private readonly repository: OrderRepository;
  private readonly cartRepository: CartRepository;
  private readonly cacheService: CacheService;
  private readonly rabbitMQ:  typeof ProducerService;

  constructor(repository: OrderRepository, cartRepository: CartRepository, cacheService: CacheService, rabbitMQ:  typeof ProducerService) {
    this.repository = repository;
    this.cartRepository = cartRepository;
    this.cacheService = cacheService;
    this.rabbitMQ = rabbitMQ;
  }

  public async createOrder(userId: number): Promise<OrderDTO> {
    let cartItems: CartItemDTO[];
    const cartCache = await this.cacheService.get(`cart:${userId}`);
    if (cartCache) {
      cartItems = JSON.parse(cartCache);
    } else {
      const cart = await this.cartRepository.isCartExist(userId);
      if (!cart) {
        throw new NotFoundError('Cart is empty!');
      }
      cartItems = await this.cartRepository.getCartItems(cart.id);
      await this.cartRepository.updateStatus(cart.id);
    }

    const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const order = await this.repository.createOrder(userId, total);
    for (const item of cartItems) {
      await this.repository.createOrderItem(
        order.id, item.coffee_id, item.quantity, item.price, item.total_price
      );
    }
    await this.cacheService.del(`cart:${userId}`);

    const data = {
      userId,
      cartItems,
    };
    
    await this.rabbitMQ.sendMessage('checkout', data);
    return order;
  }

  public async getOrderList(userId: number): Promise<OrderDTO[]> {
    const orders = await this.repository.getOrderList(userId);
    return orders;
  }

  public async getOrderDetails(orderId: number): Promise<OrderItemDTO[]> {
    const orderItems = await this.repository.getOrderDetails(orderId);
    if (!orderItems[0]) {
      throw new NotFoundError('Order not found!');
    }
    return orderItems;
  }

  public async updateStatus(orderId: number, status: string): Promise<boolean> {
    const order = await this.repository.updateStatus(orderId, status);
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return true;
  }

  public async deleteOrder(orderId: number): Promise<boolean> {
    const order = await this.repository.deleteOrder(orderId);
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return true;
  }
}

export default OrderService;
