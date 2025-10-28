import amqp from 'amqplib';
import { CartRepository } from './repositories';
import { CartService } from './services';
import pool from './config/db';
import configuration from './config';
import { logger } from './config/winston';
import Listener from './listener';

const init = async (): Promise<void> => {
  const RABBITMQ_URL = configuration.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  const cartService = new CartService(new CartRepository(pool));

  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue('checkout', {
    durable: true,
  });

  const listener = new Listener(cartService, channel);

  logger.info('Listening to queue: checkout');
  channel.consume('checkout', listener.listen, { noAck: false });
};

init();