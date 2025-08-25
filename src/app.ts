import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import { logger } from './middlewares/logger';
import { corsOptions } from './config/corsOptions';
import { errorHandler } from './middlewares/errorHandler';
import swagger from './docs/swagger.json';
import v1Routes from './routers/v1';

const app = express();

app.use(cookieParser());
app.use(compression({
  threshold: 1024,
}));
app.use(helmet());
app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use('/api/v1', v1Routes);
app.use(errorHandler);

export default app;
