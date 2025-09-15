import app from './app';
import config from './config';
import { winlogger } from './config/winston';
import pool from './config/db';

// app.listen(config.PORT, () => console.log(`Server is running on port: http://localhost:${config.PORT}`));

(async () => {
  try {
    app.listen(config.PORT, () => {
      winlogger.info('Server is running on port http://localhost:' + config.PORT);
    });
  } catch (err) {
    winlogger.error('Failed to start the server:', err);
    
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await pool.end();
    winlogger.warn('Shutting down server gracefully...');
    process.exit(0);
  } catch (err) {
    winlogger.error('Error during server shutdown:', err);
    
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
