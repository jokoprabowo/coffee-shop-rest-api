import { CartRepository } from './repositories';
import { CartService } from './services';
import { pool, logger, connectRabbitMQ } from '@project/shared';
import Listener from './listener';

const init = async (): Promise<void> => {
  try {
    const cartService = new CartService(new CartRepository(pool));
    const channel = await connectRabbitMQ();

    await channel.assertQueue('checkout', {
      durable: true,
    });

    const listener = new Listener(cartService, channel);

    logger.info('Listening to queue: checkout');
    channel.consume('checkout', listener.listen, { noAck: false });
  } catch (err) {
    logger.error('Error initializing consumer service', err);
  }
};

init();