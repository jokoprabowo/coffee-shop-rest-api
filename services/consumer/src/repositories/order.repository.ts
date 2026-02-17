import { Pool } from 'pg';

class OrderRepository {
  constructor(private readonly database: Pool) {}

  public async updateOrderStatus(orderId: number, status: string): Promise<boolean> {
    const query = {
      text: 'update orders set status = $1, updated_at = $2 where id = $3',
      values: [status, new Date(), orderId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async deleteUnpaidOrder(): Promise<boolean> {
    const query = {
      text: 'delete from orders where status in (\'unpaid\', \'cancelled\') and updated_at < now() - interval \'1 days\'',
      values: []
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async deletePaidOrder(): Promise<boolean> {
    const query = {
      text: 'delete from orders where status = \'paid\' and updated_at < now() - interval \'30 days\'',
      values: []
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default OrderRepository;
