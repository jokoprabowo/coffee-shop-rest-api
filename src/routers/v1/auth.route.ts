import { Router } from 'express';
import pool from '../../config/db';
import { AuthController } from '../../controllers';
import { AuthService, UserService, RefreshTokenService } from '../../services';
import { UserRepository, RefreshTokenRepository } from '../../repositories';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import AuthenticateValidator from '../../validators/authentication';

const repository = new UserRepository(pool);
const service = new AuthService(new UserService(repository));
const controller = new AuthController(service, new RefreshTokenService(new RefreshTokenRepository(pool)), AuthenticateValidator);
const middleware = new AuthMiddleware(new UserService(repository));
const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: Login into user account
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login request'
 *    responses:
 *      200:
 *        description: Successfully login into user account
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: OK
 *                message:
 *                  type: string
 *                  example: User login successfully
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      $ref: '#/components/schemas/User'
 *                    accessToken:
 *                      type: string
 *                      example: eqwkhbu283igsiug921giwge19whve2y1.hjdgas71fuawsyfd1
 *      400:
 *        description: Invalid login input
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: BAD_REQUEST
 *                message:
 *                  type: string
 *                  example: Invalid input
 *      404:
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: NOT_FOUND
 *                message:
 *                  type: string
 *                  example: User not found!
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *    summary: Register new user account
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Register User'
 *    responses:
 *      201:
 *        description: Successfully register new user account
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: SUCCESS
 *                message:
 *                  type: string
 *                  example: User successfully created!
 *                data:
 *                  type: object
 *                  properties:
 *                    user:
 *                      $ref: '#/components/schemas/User'
 *                    accessToken:
 *                      type: string
 *                      example: eqwkhbu283igsiug921giwge19whve2y1.hjdgas71fuawsyfd1
 *      400:
 *        description: Invalid registration input
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: BAD_REQUEST
 *                message:
 *                  type: string
 *                  example: Invalid input
 *      403:
 *        description: Unauthorized admin registration attempt
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: UNAUTHORIZED
 *                message:
 *                  type: string
 *                  example: You are not allowed to register as an admin!
 *      409:
 *        description: Email input already used
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: CONFLICT_ERROR
 *                message:
 *                  type: string
 *                  example: Email already in used!
 */
router.post('/register', controller.register);

/**
 * @swagger
 *  /api/v1/auth/refresh-token:
 *    post:
 *      summary: Get new access token
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deviceInfo:
 *                  type: string
 *                  example: Name of User Phone
 *                ipAddress:
 *                  type: string
 *                  example: 192.168.1.1
 *      responses:
 *        200:
 *          description: Successfully logout from user account
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
 *                    example: Access token refreshed!
 *      400:
 *        description: Invalid refresh token
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: BAD_REQUEST
 *                message:
 *                  type: string
 *                  example: Invalid refresh token
 *      403:
 *        description: Reuse revoked refresh token
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: FORBIDDEN
 *                message:
 *                  type: string
 *                  example: Refresh token has been revoked. Please login again!
 */
router.post('/refresh-token', middleware.authorize, controller.refreshToken);

/**
 * @swagger
 *  /api/v1/auth/logout:
 *    delete:
 *      summary: Logout from user account
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successfully logout from user account
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
 *                    example: User logged out successfully
 */
router.delete('/logout', middleware.authorize, controller.logout);


export default router;
