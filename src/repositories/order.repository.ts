import { Pool } from 'pg';

class OrderRepository{
  private readonly database: Pool;
  
  constructor(database: Pool) {
    this.database = database;
  }

  public async createOrder(userId: number, total: number) {
    const query = {
      text: 'insert into orders (user_id, total) values ($1, $2) returning id',
      values: [userId, total],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async createOrderItem(orderId: number, coffeeId: number, quantity: number, unitPrice: number, totalPrice: number) {
    const query = {
      text: 'insert into order_items (order_id, coffee_id, quantity, unit_price, total_price) '+
      'values ($1, $2, $3, $4, $5)',
      values: [orderId, coffeeId, quantity, unitPrice, totalPrice],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async getOrderList(userId: number) {
    const query = {
      text: 'select o.id, o.status, o.total, sum(oi.total_price) as total_price from orders '+
      'join order_items oi on oi.order_id = o.id where user_id = $1 order by created_at desc',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async getOrderDetails(orderId: number) {
    const query = {
      text: 'select coffee_id, quantity, unit_price, total_price where order_id = $1',
      values: [orderId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async updateStatus(orderId: number, status: string) {
    const query = {
      text: 'update from orders set status = $1 where id = $2',
      values: [status, orderId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async deleteOrder(orderId: number) {
    const query = {
      text: 'delete from orders where id = $1',
      values: [orderId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default OrderRepository;
