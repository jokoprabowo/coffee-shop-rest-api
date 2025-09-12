import { Pool } from 'pg';

class CartRepository {
  private readonly database: Pool;
  
  constructor(database: Pool) {
    this.database = database;
  }

  public async create(userId: number) {
    const query = {
      text: 'insert into carts(user_id) values ($1) returning id',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async isCartExist(userId: number) {
    const query = {
      text: 'select id from carts where user_id = $1 and status = \'open\'',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async createItem(cartId: string, coffeeId: number, quantity: number) {
    const query = {
      text: 'insert into cart_items(cart_id, coffee_id, quantity) values ($1, $2, $3)',
      values: [cartId, coffeeId, quantity],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async getCartItems(cartId: number) {
    const query = {
      text: 'select c.id as cart_id, ci.id as cart_item_id, ci.coffee_id, co.name, co.price, '+
      'ci.quantity, (co.price * ci.quantity) as total_price '+
      'from carts c inner join cart_items ci on ci.cart_id = c.id '+
      'inner join coffees co on co.id = ci.coffee_id '+
      'where c.id = $1 order by ci.id',
      values: [cartId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async updateStatus(cartId: number) {
    const query = {
      text: 'update carts set status = \'checked_out\' where id = $1',
      values: [cartId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async updateItem(cartItemId: number, quantity: number) {
    const query = {
      text: 'update cart_items set quantity = $1, updated_at = $2 where id = $3',
      values: [quantity, new Date(), cartItemId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async deleteItem(cartItemId: number) {
    const query = {
      text: 'delete from cart_items where id = $1',
      values: [cartItemId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default CartRepository;