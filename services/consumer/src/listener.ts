import { CartService, EmailService, UserService } from './services';
import { Channel, ConsumeMessage } from 'amqplib';
import { logger, Database } from '@project/shared';
import { CartItemDTO } from './dto/cart.dto';

class Listener{
  constructor(
    private readonly db: Database,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly emailService: EmailService,
    private readonly channel: Channel,
  ) {
    this.listenOrder = this.listenOrder.bind(this);
    this.listenVerificationEmail = this.listenVerificationEmail.bind(this);
    this.listenResetPassword = this.listenResetPassword.bind(this);
  }

  public async listenOrder(message: ConsumeMessage | null): Promise<void> {
    return this.structure(message, async (msg) => {
      return this.db.withTransaction(async () => {
        const { userId, cartItems } = JSON.parse(msg.content.toString());
        const isUserExist = await this.userService.isUserExist(userId);
        if (!isUserExist) {
          return;
        }

        let cart = await this.cartService.isCartExist(userId);
        cart ??= await this.cartService.createCart(userId);

        cartItems.find( async (item: CartItemDTO) => {
          if (typeof item.cart_item_id === 'string') {
            await this.cartService.addToCart(cart.id, item.coffee_id, item.quantity);
          }
        });
        await this.cartService.updateCartStatus(cart.id);
  
        this.channel.ack(msg);
      });
    });
  }

  public async listenVerificationEmail(message: ConsumeMessage | null): Promise<void> {
    return this.structure(message, async (msg) => {
      const { email, fullname, token, expiresAt } = JSON.parse(msg.content.toString());
      
      await this.emailService.sendVerificationEmail(email, fullname, token, expiresAt);

      this.channel.ack(msg);
    });
  }

  public async listenResetPassword(message: ConsumeMessage | null): Promise<void> {
    return this.structure(message, async (msg) => {
      const { email, fullname, token, expiresAt } = JSON.parse(msg.content.toString());
      
      await this.emailService.sendResetPassword(email, fullname, token, expiresAt);

      this.channel.ack(msg);
    });
  }

  private getRetryCount(message: ConsumeMessage): number {
    const count = message.properties.headers?.['x-retry'] ?? 0;
    return Number(count);
  }

  private incrementRetryHeader(message: ConsumeMessage): void {
    const newCount = this.getRetryCount(message) + 1;
    message.properties.headers!['x-retry'] = newCount;
  }

  private async structure(message: ConsumeMessage | null, handler: (msg : ConsumeMessage) => Promise<void>): Promise<void> {
    if (!message) return;
    try {
      await handler(message);
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
  
}

export default Listener;
