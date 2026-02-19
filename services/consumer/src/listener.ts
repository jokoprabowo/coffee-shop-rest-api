import { CartService, OrderService, EmailService, UserService, PaymentService } from './services';
import { Channel, ConsumeMessage } from 'amqplib';
import { mapTransactionStatus } from './utils/midtrans';
import { logger, Database } from '@project/shared';
import { CartItemDTO } from './dto/cart.dto';

class Listener{
  constructor(
    private readonly db: Database,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly emailService: EmailService,
    private readonly paymentService: PaymentService,
    private readonly channel: Channel,
  ) {
    this.listenOrder = this.listenOrder.bind(this);
    this.listenVerificationEmail = this.listenVerificationEmail.bind(this);
    this.listenResetPassword = this.listenResetPassword.bind(this);
    this.listenPayment = this.listenPayment.bind(this);
    this.listenPaymentEvent = this.listenPaymentEvent.bind(this);
  }

  public async listenPayment(message: ConsumeMessage | null): Promise<void> {
    return this.structure(message, async (msg) => {
      const { orderId, transaction_token, amount } = JSON.parse(msg.content.toString());
      const payment = await this.paymentService.createPayment(orderId, transaction_token, amount);
      if (!payment) {
        return;
      }
      this.channel.ack(msg);
    });
  }

  public async listenPaymentEvent(message: ConsumeMessage | null): Promise<void> {
    return this.structure(message, async (msg) => {
      return this.db.withTransaction(async () => {
        const { paymentEventId } = JSON.parse(msg.content.toString());
        const paymentEvent = await this.paymentService.getPaymentEventById(paymentEventId);
        if (!paymentEvent) {
          return;
        }

        const paymentId = paymentEvent.payment_id;
        const payload = JSON.parse(paymentEvent.payload_hash);

        const transactionStatus = mapTransactionStatus(payload.transaction_status, payload.fraud_status);

        await this.paymentService.updatePayment(paymentId, payload.payment_type, transactionStatus);
        await this.orderService.updateOrderStatus(payload.order_id, transactionStatus);
        this.channel.ack(msg);
      });
    });
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
        this.channel.nack(message, false, false);
      }
    }    
  }
  
}

export default Listener;
