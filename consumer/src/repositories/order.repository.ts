import { Pool } from 'pg';

class OrderRepository {
  private readonly database: Pool;

  constructor(database: Pool) {
    this.database = database;
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
