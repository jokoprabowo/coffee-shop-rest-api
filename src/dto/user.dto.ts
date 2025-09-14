export enum userRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - fullname
 *          - address
 *          - phone
 *          - email
 *          - password
 *          - role
 *        properties:
 *          fullname:
 *            type: string
 *            description: User's fullname
 *            example: Joko Prabowo
 *          address:
 *           type: string
 *           description: User's address
 *           example: Jl. Kemerdekaan, Perumahan Sastra Asri, Blok A2/12
 *          phone:
 *            type: string
 *            description: User's phone number
 *            example: 08987654321
 *          email:
 *            type: string
 *            description: User's email
 *            example: joko@mail.com
 *          password:
 *            type: string
 *            description: Account's password
 *            example: example12345
 *          role:
 *            type: string
 *            description: Account's role
 *            enum: [customer, admin]
 *            example: customer
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Register User:
 *        type: object
 *        required:
 *          - fullname
 *          - address
 *          - phone
 *          - email
 *          - password
 *        properties:
 *          fullname:
 *            type: string
 *            description: User's fullname
 *            example: Joko Prabowo
 *          address:
 *           type: string
 *           description: User's address
 *           example: Jl. Kemerdekaan, Perumahan Sastra Asri, Blok A2/12
 *          phone:
 *            type: string
 *            description: User's phone number
 *            example: 08987654321
 *          email:
 *            type: string
 *            description: User's email
 *            example: joko@mail.com
 *          password:
 *            type: string
 *            description: Account's password
 *            example: example12345
 *          role:
 *            type: string
 *            description: Account's role
 *            enum: [customer, admin]
 *            example: customer
 *          deviceInfo:
 *            type: string
 *            example: Name of User Phone
 *          ipAddress:
 *            type: string
 *            example: 192.168.1.1
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Update user:
 *        type: object
 *        properties:
 *          fullname:
 *            type: string
 *            description: User's fullname
 *            example: Joko Prabowo
 *          address:
 *           type: string
 *           description: User's address
 *           example: Jl. Kemerdekaan, Perumahan Sastra Asri, Blok A2/12
 *          phone:
 *            type: string
 *            description: User's phone number
 *            example: 08987654321
 *          email:
 *            type: string
 *            description: User's email
 *            example: joko@mail.com
 *          password:
 *            type: string
 *            description: Account's password
 *            example: example12345
 *          role:
 *            type: string
 *            description: Account's role
 *            enum: [customer, admin]
 *            example: customer
 */
export interface UserDto {
  email: string,
  password: string,
  fullname: string,
  address: string,
  phone: string,
  role?: userRole
}

/**
 * @swagger
 *  components:
 *    schemas:
 *      Login request:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: User's email
 *            example: joko@mail.com
 *          password:
 *            type: string
 *            description: User's password
 *            example: Example!123
 *          deviceInfo:
 *            type: string
 *            example: Name of User Phone
 *          ipAddress:
 *            type: string
 *            example: 192.168.1.1
 */
export interface LoginUserDto {
  email: string,
  password: string,
}
