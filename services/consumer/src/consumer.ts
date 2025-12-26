import { UserRepository, CartRepository } from './repositories';
import { UserService, CartService, EmailService } from './services';
import { pool, logger, connectRabbitMQ } from '@project/shared';
import { mailer } from './config';
import Listener from './listener';

const init = async (): Promise<void> => {
  try {
    const userService = new UserService(new UserRepository(pool));
    const cartService = new CartService(new CartRepository(pool));
    const emailService = new EmailService(mailer);
    const channel = await connectRabbitMQ();
    const listener = new Listener(userService, cartService, emailService, channel);

    const queues = ['checkout', 'email_verification', 'password_reset'];

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