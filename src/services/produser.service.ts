import amqp from 'amqplib';
import config from '../config';

const RABBITMQ_URL = config.RABBITMQ_URL || 'amqp://localhost';
export const ProducerService = {
  sendMessage: async (queue: string, message: unknown) => {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    setTimeout(() => {
      connection.close();
    }, 1000);
  }
};