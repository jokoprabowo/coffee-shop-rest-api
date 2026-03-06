import { connectRabbitMQ } from '@project/shared';

export const ProducerService = {
  sendMessage: async (queue: string, message: unknown) => {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
};