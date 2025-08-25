import { Request, Response } from 'express';
import { logEvents } from './logger';

export const errorHandler = (err: Error, req: Request, res: Response): void => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
  console.log(err.stack);
  const status = res.statusCode ? res.statusCode : 500;

  res.status(status).json({
    messaage: err.message,
  });
};
