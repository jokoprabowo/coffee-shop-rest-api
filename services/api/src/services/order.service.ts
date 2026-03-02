import { Database } from '@project/shared';
import { midtransSnap } from '../config/midtrans';
import { UserRepository, CartRepository, OrderRepository } from '../repositories';
import { CacheService, ProducerService } from '.';
import { AuthorizationError, NotFoundError } from '../exceptions';
import { CartItemDTO, OrderDTO, OrderItemDTO } from '../dto';

class OrderService {
  constructor(
    private readonly db: Database,
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly cartRepository: CartRepository,
    private readonly cacheService: CacheService,
    private readonly rabbitMQ:  typeof ProducerService,
    private readonly snapClient: typeof midtransSnap,
  ) {}

  public async createOrder(userId: number): Promise<OrderDTO> {
    return this.db.withTransaction(async () => {
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
      const order = await this.orderRepository.createOrder(userId, total);
      for (const item of cartItems) {
        await this.orderRepository.createOrderItem(
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
    });
  }

  public async createTransaction(userId: number, orderId: number): Promise<{redirect_url: string, token: string}> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found!');
    }

    await this.verifyOrderOwnership(orderId, userId);

    const orderItems = await this.orderRepository.getOrderDetails(orderId);
    const orderTotalPrice = orderItems.reduce((acc , item) => acc + item.total_price, 0);
    
    const parameter = {
      'transaction_details': {
        'order_id': orderId.toString(),
        'gross_amount': orderTotalPrice,
      },
      'item_details': orderItems.map(item => ({
        'id': item.coffee_id,
        'price': item.unit_price,
        'quantity': item.quantity,
        'name': item.name,
      })),
      'credit_card':{
        'secure' : true
      },
      'customer_details': {
        'first_name': user.fullname.split(' ')[0],
        'last_name': user.fullname.split(' ')[1] || ' ',
        'email': user.email,
        'phone': user.phone,
        'address': user.address,
      }
    };
    const transaction = await this.snapClient.createTransaction(parameter);

    await this.rabbitMQ.sendMessage('create_payment', {
      orderId,
      transaction_token: transaction.token,
      amount: orderTotalPrice,
    });
    return transaction;
  }

  public async getOrderList(userId: number): Promise<OrderDTO[]> {
    const orders = await this.orderRepository.getOrderList(userId);
    return orders;
  }

  public async getOrderDetails(orderId: number, userId: number): Promise<OrderItemDTO[]> {
    await this.verifyOrderOwnership(orderId, userId);
    const orderItems = await this.orderRepository.getOrderDetails(orderId);
    if (!orderItems[0]) {
      throw new NotFoundError('Order not found!');
    }
    return orderItems;
  }

  public async updateStatus(orderId: number, status: string, userId: number): Promise<boolean> {
    await this.verifyOrderOwnership(orderId, userId);
    const order = await this.orderRepository.updateStatus(orderId, status);
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return true;
  }

  public async deleteOrder(orderId: number, userId: number): Promise<boolean> {
    await this.verifyOrderOwnership(orderId, userId);
    const order = await this.orderRepository.deleteOrder(orderId);
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return true;
  }

  public async getMonthlyOrderStats(month: number, year: number, statuses: string[]): Promise<{
    date: Date, totalOrders: number, totalRevenue: number }[]> {
    return await this.orderRepository.getMonthlyOrderStats(month, year, statuses);
  }

  public async verifyOrderOwnership(orderId: number, userId: number): Promise<void> {
    const isOwner = await this.orderRepository.verifyOrderOwnership(orderId, userId);
    if (!isOwner) {
      throw new AuthorizationError('You are not authorized to access this order!');
    }
  }
}

export default OrderService;
