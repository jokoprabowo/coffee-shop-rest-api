import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import config from './config';
import { logInfo } from './config/logger';
import { corsOptions } from './config/corsOptions';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { swaggerOptions } from './docs/swagger';
import { globalRateLimiter } from './middlewares/rateLimiter';
import v1Routes from './routes/v1';

const app = express();
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cookieParser());
app.use(compression({
  threshold: 1024,
}));
app.use(helmet());
app.use(cors(corsOptions));
app.use(logInfo);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authExcluePaths = new Set(['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/forgot-password']);
if(config.NODE_ENV !== 'test') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if(authExcluePaths.has(req.path)) {
      return next();
    }
    globalRateLimiter(req, res, next);
  });
}

app.use('/api/v1', v1Routes);
app.use(errorHandler);

export default app;
