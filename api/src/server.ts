import app from './app';
import configuration from './config';
import { logger } from './config/winston';
import pool from './config/db';
import redis from './config/redis';

(async () => {
  try {
    app.listen(configuration.PORT, () => {
      logger.info('Server is running at http://localhost:' + configuration.PORT);
    });
  } catch (err) {
    logger.error('Failed to start the server:', err);
    
    if (configuration.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await redis.quit();
    await pool.end();
    logger.warn('Shutting down server gracefully...');
    process.exit(0);
  } catch (err) {
    logger.error('Error during server shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
