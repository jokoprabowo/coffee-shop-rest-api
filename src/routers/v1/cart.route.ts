import express from 'express';
import pool from '../../config/db';
import { CartRepository, UserRepository } from '../../repositories';
import { CartService, UserService } from '../../services';
import { CartController } from '../../controllers';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();
const repository = new CartRepository(pool);
const service = new CartService(repository);
const controller = new CartController(service);
const middleware = new AuthMiddleware(new UserService(new UserRepository(pool)));

/**
 * @swagger
 *  components:
 *    schemas:
 *      CartItems:
 *        type: object
 *        properties:
 *          cart_id:
 *            type: integer
 *            example: 1
 *          cart_item_id:
 *            type: integer
 *            example: 1
 *          name:
 *            type: string
 *            example: Americano
 *          price:
 *            type: integer
 *            example: 12000
 *          quantity:
 *            type: integer
 *            example: 2
 *          total_price_per_item:
 *            type: integer
 *            example: 24000
 */

/**
 * @swagger
 *  /api/v1/cart:
 *    post:
 *      summary: Add coffee to the cart
 *      tags: [Carts]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                coffeeId:
 *                  type: integer
 *                  example: 1
 *                quantity:
 *                  type: integer
 *                  example: 1
 *      responses:
 *        201:
 *          description: Successfully add a coffee to the cart
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
 *                    example: Cart item has been added!
 *                  data:
 *                    type: object
 *                    properties:
 *                      cartItems:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/CartItems'
 *          401:
 *            description: Unauthenticated, login required!
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: UNAUTHENTICATED
 *                    message:
 *                      type: string
 *                      example: Login required!
 */
router.post('/', middleware.authorize, controller.addToCart);

/**
 * @swagger
 *  /api/v1/cart:
 *    get:
 *      summary: Retrieve all cart items
 *      tags: [Carts]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successfully retrieve cart items
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
 *                    example: Cart items have been retrieved!
 *        401:
 *          description: Unauthenticated, login required!
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: UNAUTHENTICATED
 *                    message:
 *                      type: string
 *                      example: Login required!
 */
router.get('/', middleware.authorize, controller.getCartItems);

/**
 * @swagger
 *  /api/v1/cart:
 *    put:
 *      summary: Update cart item quantity
 *      tags: [Carts]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cartItemId:
 *                  type: integer
 *                  example: 1
 *                quantity:
 *                  type: integer
 *                  example: 1
 *      responses:
 *        200:
 *          description: Successfully update quantity of cart item
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
 *                    example: Cart items have been updated!
 *        401:
 *          description: Unauthenticated, login required!
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: UNAUTHENTICATED
 *                    message:
 *                      type: string
 *                      example: Login required!
 *        404:
 *          description: Cart item not found
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
 *                      example: Cart item not found!
 */
router.put('/', middleware.authorize, controller.updateItem);

/**
 * @swagger
 *  /api/v1/cart:
 *    delete:
 *      summary: Delete cart item
 *      tags: [Carts]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cartItemId:
 *                  type: integer
 *                  example: 1
 *      responses:
 *        200:
 *          description: Successfully delete cart item
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
 *                    example: Cart items have been deleted!
 *        401:
 *          description: Unauthenticated, login required!
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: UNAUTHENTICATED
 *                    message:
 *                      type: string
 *                      example: Login required!
 *        404:
 *          description: Cart item not found
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
 *                      example: Cart item not found!
 */
router.delete('/', middleware.authorize, controller.deleteItem);

export default router;
