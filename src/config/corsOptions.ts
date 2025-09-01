import config from './';
import type { CorsOptions } from 'cors';

export const corsOptions : CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin || 
      (Array.isArray(config.WHITELIST_ORIGINS) && config.WHITELIST_ORIGINS.includes(origin))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: ${origin} is not allowed by CORS policy`), false);
    }
  },
};
