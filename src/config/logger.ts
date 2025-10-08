import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { logger } from './winston';

export const logEvents = async (message: string, logFileName: string): Promise<void> => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${v4()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};

export const logInfo = (req: Request, res: Response, next: NextFunction): void => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
  logger.info(`${req.method} ${req.path}`);
  next();
};
