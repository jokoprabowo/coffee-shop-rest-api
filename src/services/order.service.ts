import { CartRepository, OrderRepository } from '../repositories';
import { NotFoundError } from '../exceptions';

class OrderService {
  private readonly repository: OrderRepository;
  private readonly cartRepository: CartRepository;

  constructor(repository: OrderRepository, cartRepository: CartRepository) {
    this.repository = repository;
    this.cartRepository = cartRepository;
  }

  public async createOrder(userId: number) {
    const cart = await this.cartRepository.isCartExist(userId);
    if (!cart){
      throw new NotFoundError('Cart is empty!');
    }

    const cartItems= await this.cartRepository.getCartItems(cart.id);
    const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const order = await this.repository.createOrder(userId, total);
    await this.cartRepository.updateStatus(cartItems[0].cart_id);

    for (const item of cartItems) {
      await this.repository.createOrderItem(
        order.id, item.coffee_id, item.quantity, item.price, item.total_price
      );
    }
    return order;
  }

  public async getOrderList(userId: number) {
    const orders = await this.repository.getOrderList(userId);
    return orders;
  }

  public async getOrderDetails(orderId: number) {
    const orderItems = await this.repository.getOrderDetails(orderId);
    return orderItems;
  }

  public async updateStatus(orderId: number, status: string) {
    const order = await this.repository.updateStatus(orderId, status);
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return true;
  }

  public async deleteOrder(orderId: number) {
    const order = await this.repository.deleteOrder(orderId);
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return true;
  }
}

export default OrderService;
