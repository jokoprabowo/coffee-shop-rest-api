import configuration from './';
import type { CorsOptions } from 'cors';

export const corsOptions : CorsOptions = {
  origin(origin, callback) {
    if (configuration.NODE_ENV === 'development' || !origin || 
      (Array.isArray(configuration.WHITELIST_ORIGINS) && configuration.WHITELIST_ORIGINS.includes(origin))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: ${origin} is not allowed by CORS policy`), false);
    }
  },
};
