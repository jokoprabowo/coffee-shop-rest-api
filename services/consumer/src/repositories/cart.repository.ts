import { Pool } from 'pg';
import { CartDTO, CartItemDTO } from '../dto/cart.dto';

class CartRepository {
  private readonly database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  public async insertIntoCartItem(cartId: number, coffeeId: number, quantity: number): Promise<CartItemDTO> {
    const query = {
      text: 'insert into cart_items(cart_id, coffee_id, quantity) values ($1, $2, $3)',
      values: [cartId, coffeeId, quantity],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  };

  public async createCart(userId: number): Promise<Pick<CartDTO, 'id'>> {
    const query = {
      text: 'insert into carts(user_id) values ($1) returning id',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  };

  public async isCartExist(userId: number): Promise<Pick<CartDTO, 'id'> | null> {
    const query = {
      text: 'select id from carts where user_id = $1 and status = \'open\'',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async updateCartStatus(cartId: number): Promise<boolean> {
    const query = {
      text: 'update carts set status = \'checked_out\' where id = $1',
      values: [cartId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async deleteCart(): Promise<boolean> {
    const query = {
      text: 'delete from carts where status = \'checked_out\' and updated_at < now() - interval \'30 days\'',
      values: []
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default CartRepository;
