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
      text: 'select o.id, o.status, o.total, sum(oi.total_price) as total_price from orders o '+
      'inner join order_items oi on oi.order_id = o.id where user_id = $1 group by o.id, o.status, o.total '+
      'order by o.created_at desc',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async getOrderDetails(orderId: number) {
    const query = {
      text: 'select c.name, oi.quantity, oi.unit_price, oi.total_price from order_items oi '+
      'inner join coffees c on c.id = oi.coffee_id where order_id = $1',
      values: [orderId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async updateStatus(orderId: number, status: string) {
    const query = {
      text: 'update orders set status = $1, updated_at = $2 where id = $3',
      values: [status, new Date(), orderId],
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
