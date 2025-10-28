import { CartService } from './services';
import { Channel, ConsumeMessage } from 'amqplib';
import { logger } from './config/winston';
import { CartItemDTO } from './dto/cart.dto';

class Listener{
  private readonly cartService: CartService;
  private readonly channel: Channel;

  constructor(cartService: CartService, channel: Channel) {
    this.cartService = cartService;
    this.channel = channel;

    this.listen = this.listen.bind(this);
  }

  public async listen(message: ConsumeMessage | null): Promise<void> {
    if (!message) return;
    try {
      const { userId, cartItems } = JSON.parse(message.content.toString());
      let cart = await this.cartService.isCartExist(userId);
      if (!cart) {
        cart = await this.cartService.createCart(userId);
      }

      cartItems.find( async (item: CartItemDTO) => {
        if (typeof item.cart_item_id === 'string') {
          await this.cartService.addToCart(cart.id, item.coffee_id, item.quantity);
        }
      });
      await this.cartService.updateCartStatus(cart.id);

      this.channel.ack(message);
    } catch (err) {
      logger.error('Error processing message', err);

      const retries = this.getRetryCount(message);

      if (retries >= 3) {
        logger.warn(`Message failed after ${retries} retries. Sending to DLQ.`);
        this.channel.reject(message, false);
      } else {
        this.incrementRetryHeader(message);
        this.channel.nack(message, false, true);
      }
    }
  }

  private getRetryCount(message: ConsumeMessage): number {
    const count = message.properties.headers?.['x-retry'] ?? 0;
    return Number(count);
  }

  private incrementRetryHeader(message: ConsumeMessage): void {
    const newCount = this.getRetryCount(message) + 1;
    message.properties.headers!['x-retry'] = newCount;
  }
  
}

export default Listener;
