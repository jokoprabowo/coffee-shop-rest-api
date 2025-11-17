import app from './app';
import config from './config';
import { pool, logger, redis } from '@project/shared';

(async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info('Server is running at http://localhost:' + config.PORT);
    });
  } catch (err) {
    logger.error('Failed to start the server:', err);
    
    if (config.NODE_ENV === 'production') {
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
