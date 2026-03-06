import { UserRepository, CartRepository, OrderRepository, PaymentRepository } from './repositories';
import { UserService, CartService, OrderService, EmailService, PaymentService } from './services';
import { pool, logger, connectRabbitMQ, Database } from '@project/shared';
import { mailer } from './config';
import Listener from './listener';

const init = async (): Promise<void> => {
  try {
    const db = new Database(pool);
    const userService = new UserService(new UserRepository(pool));
    const cartService = new CartService(new CartRepository(pool));
    const orderService = new OrderService(new OrderRepository(pool));
    const paymentService = new PaymentService(new PaymentRepository(pool));
    const emailService = new EmailService(mailer);
    const channel = await connectRabbitMQ();
    const listener = new Listener(db, userService, cartService, orderService, emailService, paymentService, channel);

    const queues = ['checkout', 'email_verification', 'password_reset', 'create_payment', 'payment_event'];

    for (const queue of queues) {
      await channel.assertQueue(queue, {
        durable: true,
      });

      channel.consume(queue, (msg) => {
        switch (queue) {
          case 'checkout':
            return listener.listenOrder(msg);
          
          case 'email_verification':
            return listener.listenVerificationEmail(msg);

          case 'password_reset':
            return listener.listenResetPassword(msg);

          case 'create_payment':
            return listener.listenPayment(msg);
          
          case 'payment_event':
            return listener.listenPaymentEvent(msg);
            
          default:
            logger.warn('No handler for queue:', queue);
        }
      }, { noAck: false });

      logger.info(`Listening to queue: ${queue}`);
    }

  } catch (err) {
    logger.error('Error initializing consumer service', err);
  }
};

init();