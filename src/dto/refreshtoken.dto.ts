/**
 * @swagger
 *  components:
 *    schemas:
 *      Refresh token:
 *        type: object
 *        required:
 *          - user_id
 *          - token
 *          - device_info
 *          - ip_address
 *          - expires_at
 *        properties:
 *          user_id:
 *            type: integer
 *            description: Id of the user
 *            example: 1
 *          token:
 *            type: string
 *            description: token of users refresh token
 *            example: 6983fc59d1d8479b319a729c09b20f0e40aff8ef9d65c920309472266f724ae6
 */

export interface RefreshToken {
  user_id: number;
  token: string;
  device_info?: string;
  ip_address?: string;
  expires_at: Date;
}
