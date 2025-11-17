import amqp from 'amqplib';
import { logger } from '../utils';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

const connectRabbitMQ = async (
  retries: number = 5,
  delayMs: number = 5000
): Promise<amqp.Channel> => {
  for (let i = 1; i <= retries; i++) {
    try {
      if (channel) return channel;

      if (!connection) {
        connection = await amqp.connect(RABBITMQ_URL);
        connection.on('close', () => {
          logger.warn('RabbitMQ connection closed. Reconnecting...');
          connection = null;
          channel = null;
        });
      }
      channel = await connection.createChannel();
      logger.info('Connected to RabbitMQ successfully');
      return channel;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  logger.error('Failed to connect to RabbitMQ');
  throw new Error('Could not connect to RabbitMQ after multiple attempts');
}

export default connectRabbitMQ;
