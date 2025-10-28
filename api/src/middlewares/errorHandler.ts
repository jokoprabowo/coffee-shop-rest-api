import { NextFunction, Request, Response } from 'express';
import { logEvents } from '../config/logger';
import { logger } from '../config/winston';
import { AppError } from '../exceptions';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
  logger.error(err.message);

  if (res.headersSent) {
    return;
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong!',
  });
};
