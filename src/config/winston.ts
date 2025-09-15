import winston from 'winston';
import path from 'path';
import config from '.';

// Format custom untuk menambahkan timestamp dan level
const logFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}]: ${message}${metaString}`;
});

const buildLogger = () => {
  const { combine, timestamp, colorize, errors, json } = winston.format;
  const env = config.NODE_ENV || 'development';


  const transports: winston.transport[] = [];

  if (env === 'production') {

    transports.push(
      new winston.transports.File({
        filename: path.join(__dirname, '..', 'logs', 'error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '..', 'logs', 'combined.log'),
      })
    );
  } else if (env === 'test') {

    transports.push(
      new winston.transports.Console({
        level: 'warn',
        format: combine(timestamp(), json()),
      })
    );
  } else {

    transports.push(
      new winston.transports.Console({
        level: 'debug',
        format: combine(
          colorize({ all: true }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          logFormat
        ),
      })
    );
  }

  return winston.createLogger({
    level: env === 'production' ? 'info' : 'debug',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    ),
    transports,
    exitOnError: false,
  });
};

export const winlogger = buildLogger();
