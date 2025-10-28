import { CartRepository, OrderRepository, RefreshTokenRepository } from './repositories';
import { CacheService, CartService, OrderService, RefreshTokenService } from './services';
import { CartItemDTO } from './dto/cart.dto';
import { logger } from './config/winston';
import pool from './config/db';
import redis from './config/redis';
import cron from 'node-cron';

const init = async (): Promise<void> => {
  const cartService = new CartService(new CartRepository(pool));
  const orderService = new OrderService(new OrderRepository(pool));
  const refreshTokenService = new RefreshTokenService(new RefreshTokenRepository(pool));
  const cacheService = new CacheService(redis);

  const cartSync = async (): Promise<void> => {
    try {
      const keys = await cacheService.getKeys('cart:*', 1000);
      for (const key of keys) {
        const data = await redis.get(key);
        if (!data) continue;

        const userId = key.split(':')[1];
        const cartItem: CartItemDTO[] = JSON.parse(data);
        let cart = await cartService.isCartExist(Number(userId));
        if (!cart) {
          cart = await cartService.createCart(Number(userId));
        }

        for (const item of cartItem) {
          if (typeof item.cart_item_id === 'string') {
            await cartService.addToCart(cart.id, item.coffee_id, item.quantity);
          }
        }
        redis.del(key);
      }
    } catch (err) {
      logger.warn('Error cart synchronization', err);
    }
  };

  // cron job every 2 am
  cron.schedule('*/5 * * * *', async () => {
    await orderService.deleteUnpaidOrder().then(() => logger.info('Unpaid and cancelled order data have been deleted!'));

    // synchronize cart data from redis to postgres
    await cartSync().then(() => logger.info('Cart data have been synchronized between Redis and Pstgres!'));
  });

  // cron job every monday at 2 am
  cron.schedule('0 2 * * 1', async () => {
    await refreshTokenService.deleteToken().then(() => logger.info('Refresh token data have been deleted!'));
  });

  // cron job every 1st at 2 am
  cron.schedule('0 2 1 * *', async () => {
    await cartService.deleteCart().then(() => logger.info('Cart data have been deleted!'));
    await orderService.deletePaidOrder().then(() => logger.info('Paid order data have been deleted!'));
  });
};

init();