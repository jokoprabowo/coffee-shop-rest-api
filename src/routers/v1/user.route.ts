import { Router } from 'express';
import pool from '../../config/db';
import { UserController } from '../../controllers';
import { UserService } from '../../services';
import { UserRepository } from '../../repositories';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import UserValidator from '../../validators/user';

const repository = new UserRepository(pool);
const service = new UserService(repository);
const controller = new UserController(service, UserValidator);
const middleware = new AuthMiddleware(service);
const router = Router();

/**
 * @swagger
 * /api/v1/user/all:
 *   get:
 *     summary: Get all users data
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieve all users data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Users data have been retrieved!
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/User'
 */
router.get('/all', middleware.isAdmin, controller.getAllUsers);

/**
 * @swagger
 *  /api/v1/user/profile:
 *    get:
 *      summary: Get user details
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *       200:
 *         description: Successfully retrieve user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: User details have been retrieved!
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthenticated, login required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UNAUTHENTICATED
 *                 message:
 *                   type: string
 *                   example: Access token is missing!
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: User not found!
 */
router.get('/profile', middleware.authorize, controller.getUserDetails);

/**
 * @swagger
 *  /api/v1/user/update:
 *    put:
 *      summary: Get user details
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Update User'
 *      responses:
 *       200:
 *         description: Successfully update user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: User have been updated!
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid update input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: BAD_REQUEST
 *                 message:
 *                   type: string
 *                   example: Invalid input!
 *       401:
 *         description: Unauthenticated, login required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UNAUTHENTICATED
 *                 message:
 *                   type: string
 *                   example: Access token is missing!
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: User not found!
 */
router.put('/update', middleware.authorize, controller.updateUser);

/**
 * @swagger
 *  /api/v1/user/delete:
 *    delete:
 *      summary: Get user details
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successfully delete user
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
 *                    example: User have been deleted!
 *        401:
 *          description: Unauthenticated, login required
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
 *        404:
 *          description: User not found
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
 *                    example: User not found!
 */
router.delete('/delete', middleware.authorize, controller.deleteUser);

export default router;
