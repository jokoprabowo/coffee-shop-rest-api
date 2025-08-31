import { NextFunction, Request, Response } from 'express';
import { logEvents } from './logger';
import { AppError } from '../exceptions';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
  console.log(err.stack);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong!',
  });
};
