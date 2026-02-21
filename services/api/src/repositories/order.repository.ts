import { Pool } from 'pg';
import { OrderDTO, OrderItemDTO } from '../dto';

class OrderRepository{
  constructor(private readonly database: Pool) {}

  public async createOrder(userId: number, total: number): Promise<OrderDTO> {
    const query = {
      text: 'insert into orders (user_id, total) values ($1, $2) returning id',
      values: [userId, total],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async createOrderItem(
    orderId: number, coffeeId: number, quantity: number, unitPrice: number, totalPrice: number
  ): Promise<OrderItemDTO> {
    const query = {
      text: 'insert into order_items (order_id, coffee_id, quantity, unit_price, total_price) '+
      'values ($1, $2, $3, $4, $5)',
      values: [orderId, coffeeId, quantity, unitPrice, totalPrice],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async getOrderList(userId: number): Promise<OrderDTO[]> {
    const query = {
      text: 'select o.id, o.status, o.total, sum(oi.total_price) as total_price from orders o '+
      'inner join order_items oi on oi.order_id = o.id where user_id = $1 group by o.id, o.status, o.total '+
      'order by o.created_at desc',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async getOrderDetails(orderId: number): Promise<OrderItemDTO[]> {
    const query = {
      text: 'select c.name, oi.quantity, oi.unit_price, oi.total_price from order_items oi '+
      'inner join coffees c on c.id = oi.coffee_id where order_id = $1',
      values: [orderId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async updateStatus(orderId: number, status: string): Promise<boolean> {
    const query = {
      text: 'update orders set status = $1, updated_at = $2 where id = $3',
      values: [status, new Date(), orderId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async deleteOrder(orderId: number): Promise<boolean> {
    const query = {
      text: 'delete from orders where id = $1',
      values: [orderId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async getMonthlyOrderStats(month: number, year: number, statuses: string[]): Promise<{
    month: number, year: number, totalOrders: number, totalRevenue: number }[]> {
    const query = {
      text: `WITH date_series AS (
        SELECT generate_series(
            DATE_TRUNC('month', make_date($1, $2, 1)),
            DATE_TRUNC('month', make_date($1, $2, 1)) + INTERVAL '1 month' - INTERVAL '1 day',
            INTERVAL '1 day'
        )::date AS date
      )
      SELECT 
          ds.date,
          COALESCE(COUNT(o.id), 0) AS total_orders,
          COALESCE(SUM(o.total), 0) AS total_revenue
      FROM date_series ds
      LEFT JOIN orders o 
          ON o.created_at >= (ds.date AT TIME ZONE 'Asia/Jakarta')
          AND o.created_at < ((ds.date + INTERVAL '1 day') AT TIME ZONE 'Asia/Jakarta')
          AND ($3::text[] IS NULL OR o.status = ANY($3))
      GROUP BY ds.date
      ORDER BY ds.date`,
      values: [year, month, statuses && statuses.length > 0 ? statuses : null],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }
}

export default OrderRepository;
