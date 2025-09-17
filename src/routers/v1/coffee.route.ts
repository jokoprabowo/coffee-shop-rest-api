import { Router } from 'express';
import pool from '../../config/db';
import { CoffeeRepository, UserRepository } from '../../repositories';
import { CoffeeService, UserService } from '../../services';
import CoffeeValidator from '../../validators/coffee';
import { CoffeeController } from '../../controllers';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const repository = new CoffeeRepository(pool);
const service = new CoffeeService(repository);
const controller = new CoffeeController(service, CoffeeValidator);
const middleware = new AuthMiddleware(new UserService(new UserRepository(pool)));
const router = Router();

/**
 * @swagger
 *  /api/v1/coffee:
 *    post:
 *      summary: Create new coffee data
 *      tags: [Coffees]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Coffee'
 *      responses:
 *        200:
 *          description: Successfully create new coffee data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: SUCCESS
 *                  message:
 *                    type: string
 *                    example: Coffee has been created!
 *                  data:
 *                    type: object
 *                    properties:
 *                      coffee:
 *                        $ref: '#/components/schemas/Coffee'
 *        400:
 *          description: Invalid coffee data input
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: BAD_REQUEST
 *                  message:
 *                    type: string
 *                    example: Invalid input
 *        401:
 *          description: Unauthenticated, login require
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: UNAUTHENTICATED
 *                  message:
 *                    type: string
 *                    example: Access token is missing!
 *        403:
 *          description: Unauthorized, you have no permission
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: FORBIDDEN
 *                  message:
 *                    type: string
 *                    example: You do not have permission to access this resource!
 *        409:
 *          description: Coffee with this input data already exist
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: CONFLICT
 *                  message:
 *                    type: string
 *                    example: Coffee data already exist!
 */
router.post('/', middleware.isAdmin, controller.create);

/**
 * @swagger
 *  /api/v1/coffee:
 *    get:
 *      summary: Get all coffee data
 *      tags: [Coffees]
 *      responses:
 *        200:
 *          description: Successfully get all coffees data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: OK
 *                  message:
 *                    type: string
 *                    example: Coffees have been retrieved!
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Coffee'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 *  /api/v1/coffee/:id:
 *    get:
 *      summary: Get coffee details
 *      tags: [Coffees]
 *      responses:
 *        200:
 *          description: Successfully get coffee details
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: OK
 *                  message:
 *                    type: string
 *                    example: Coffee has been retrieved!
 *                  data:
 *                    type: object
 *                    properties:
 *                      coffee:
 *                        $ref: '#/components/schemas/Coffee'
 *        404:
 *          description: Coffee data not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: NOT_FOUND
 *                  message:
 *                    type: string
 *                    example: Coffee not found!
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 *  /api/v1/coffee/:id:
 *    put:
 *      summary: Update coffee
 *      tags: [Coffees]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Coffee'
 *      responses:
 *        200:
 *          description: Successfully update coffee data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: OK
 *                  message:
 *                    type: string
 *                    example: Coffee has been updated!
 *                  data:
 *                    type: object
 *                    properties:
 *                      coffee:
 *                        $ref: '#/components/schemas/Coffee'
 *        400:
 *          description: Invalid coffee data input
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: BAD_REQUEST
 *                  message:
 *                    type: string
 *                    example: Invalid input
 *        401:
 *          description: Unauthenticated, login require
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: UNAUTHENTICATED
 *                  message:
 *                    type: string
 *                    example: Access token is missing!
 *        403:
 *          description: Unauthorized, you have no permission
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: FORBIDDEN
 *                  message:
 *                    type: string
 *                    example: You do not have permission to access this resource!
 *        404:
 *          description: Coffee data not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: NOT_FOUND
 *                  message:
 *                    type: string
 *                    example: Coffee not found!
 */
router.put('/:id', middleware.isAdmin, controller.updateById);

/**
 * @swagger
 *  /api/v1/coffee/:id:
 *    delete:
 *      summary: Delete coffee
 *      tags: [Coffees]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successfully delete coffee
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: OK
 *                  message:
 *                    type: string
 *                    example: Coffee has been deleted!
 *        401:
 *          description: Unauthenticated, login require
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: UNAUTHENTICATED
 *                  message:
 *                    type: string
 *                    example: Access token is missing!
 *        403:
 *          description: Unauthorized, you have no permission
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: FORBIDDEN
 *                  message:
 *                    type: string
 *                    example: You do not have permission to access this resource!
 *        404:
 *          description: Coffee data not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: NOT_FOUND
 *                  message:
 *                    type: string
 *                    example: Coffee not found!
 */
router.delete('/:id', middleware.isAdmin, controller.deleteById);

export default router;
