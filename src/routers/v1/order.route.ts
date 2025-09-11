import { Router } from 'express';
import pool from '../../config/db';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRepository, CartRepository, OrderRepository } from '../../repositories';
import { UserService, OrderService } from '../../services';
import { OrderController } from '../../controllers';

const middleware = new AuthMiddleware(new UserService(new UserRepository(pool)));
const repository = new OrderRepository(pool);
const service = new OrderService(repository, new CartRepository(pool));
const controller = new OrderController(service);
const router = Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      Order:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: Order index
 *            example: 1
 *          status:
 *            type: string
 *            enum: [pending, paid, cancelled]
 *            description: Order payment status
 *            example: pending
 *          total:
 *            type: integer
 *            description: Total coffee ordered
 *            example: 6
 *          total_price:
 *            type: integer
 *            description: Total price of coffee ordered
 *            example: 72000
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      OrderDetails:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the coffee ordered
 *            example: Americano
 *          quantity:
 *            type: integer
 *            description: Quantity of coffee ordered
 *            example: 2
 *          unit_price:
 *            type: integer
 *            description: Price of coffee ordered per unit
 *            example: 12000
 *          total_price:
 *            type: integer
 *            description: Total price of the coffee ordered
 *            example: 24000
 */

/**
 * @swagger
 *  /api/v1/order:
 *    post:
 *      summary: Create order from the cart
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        201:
 *          description: Successfully order the coffee
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: CREATED
 *                  message:
 *                    type: string
 *                    example: Order has been created!
 *                  data:
 *                    type: object
 *                    properties:
 *                      order:
 *                        type: integer
 *                        example: 1
 *        401:
 *          description: Unauthenticated, login required!
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
 *                    example: Login required!
 *        404:
 *          description: There is no item on the cart
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: NOT_FOUND
 *                    message:
 *                      type: string
 *                      example: Cart is empty!
 */
router.post('/', middleware.authorize, controller.createOrder);

/**
 * @swagger
 *  /api/v1/order:
 *    get:
 *      summary: Get all order history
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successfully retrieve order histories
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
 *                    example: Orders have been retrieved!
 *                  data:
 *                    type: object
 *                    properties:
 *                      orders:
 *                        type: array
 *                        items:
 *                          $ref: 'components/schemas/Order'
 *        401:
 *          description: Unauthenticated, login required!
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
 *                    example: Login required!
 */
router.get('/', middleware.authorize, controller.getOrders);

/**
 * @swagger
 *  /api/v1/order/{id}:
 *    get:
 *      summary: Get order details
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *          description: Order index
 *      responses:
 *        200:
 *          description: Successfully retrieve order details
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
 *                    example: Order has been retrieved!
 *                  data:
 *                    type: object
 *                    properties:
 *                      orders:
 *                        type: array
 *                        items:
 *                          $ref: 'components/schemas/OrderDetails'
 *        401:
 *          description: Unauthenticated, login required!
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
 *                    example: Login required!
 */
router.get('/:id', middleware.authorize, controller.getOrderDetails);

/**
 * @swagger
 *  /api/v1/order/{id}:
 *    put:
 *      summary: Update payment status of ordered coffee
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *          description: Order index
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: paid
 *      responses:
 *        200:
 *          description: Successfully update order status
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
 *                    example: Order has been updated!
 *        401:
 *          description: Unauthenticated, login required!
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
 *                    example: Login required!
 */
router.put('/:id', middleware.authorize, controller.updateOrderStatus);

/**
 * @swagger
 *  /api/v1/order/{id}:
 *    delete:
 *      summary: Delete order history
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *          description: Order index
 *      responses:
 *        200:
 *          description: Successfully delete order status
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
 *                    example: Order has been deleted!
 *        401:
 *          description: Unauthenticated, login required!
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
 *                    example: Login required!
 */
router.delete('/:id', middleware.authorize, controller.deleteOrder);

export default router;
