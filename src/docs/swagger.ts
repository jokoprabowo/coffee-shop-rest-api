import { Options } from 'swagger-jsdoc';
import config from '../config';
import { schemas } from './schemas';
import { paths } from './paths';

const apisPath: string[] =
  process.env.NODE_ENV === 'production'
    ? ['./dist/routes/**/*.js', './dist/dto/*.js']
    : ['./src/routes/**/*.ts', './src/dto/*.ts'];

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
      {
        url: `http://backend:${config.PORT}`,
        description: 'Production server',
      },
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token authorization for API'
        }
      },
      schemas: schemas,
    },
  },
  apis: apisPath,
  x: { type: '', description: '', example: '' },
};


