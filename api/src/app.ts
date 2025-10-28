import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import { logInfo } from './config/logger';
import { corsOptions } from './config/corsOptions';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerOptions } from './docs/swagger';
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

app.use('/api/v1', v1Routes);
app.use(errorHandler);

export default app;
