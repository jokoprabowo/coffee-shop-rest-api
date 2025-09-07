import { Options } from 'swagger-jsdoc';
import config from '../config';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coffee Shop API',
      version: '1.0.0',
      description: 'Coffee Shop API Documentation',
      contact: {
        name: 'Joko Prabowo',
        email: 'jokoprabowo4550@gmail.com',
        url: 'https://github.com/jokoprabowo',
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Auth API'
      },
      {
        name: 'Users',
        description: 'Users API'
      },
      {
        name: 'Coffees',
        description: 'Coffees API'
      },
      {
        name: 'Carts',
        description: 'Carts API',
      }
    ],
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server',
      },
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token authorization for API'
        }
      }
    }
  },
  apis: ['./src/routers/v1/*.ts', './src/dto/*.ts'],
};
