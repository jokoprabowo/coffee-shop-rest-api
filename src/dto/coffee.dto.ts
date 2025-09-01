/**
 * @swagger
 * components:
 *  schemas:
 *    Coffee:
 *      type: object
 *      required:
 *        - name
 *        - price
 *        - description
 *        - image
 *      properties:
 *        name:
 *          type: string
 *          description: The coffee name
 *          example: Americano
 *        price:
 *          type: string
 *          description: The coffee price
 *          example: 15000
 *        description:
 *          type: string
 *          description: The coffee description
 *          example: A black coffee made by diluting espresso with hot water.
 *        image:
 *          type: string
 *          description: The coffee image URL
 *          example: https://example.com/americano.jpg
 */

export interface CoffeeDto {
  name: string,
  price: string,
  description: string,
  image: string,
}
