import { Pool } from 'pg';
import { PaymentDTO, PaymentEventDTO } from '../dto';

class PaymentRepository {
  constructor (private readonly database: Pool) {}

  public async create(
    orderId: number, token: string, amount: number
  ): Promise<PaymentDTO> {
    const query = {
      text: 'insert into payments (order_id, token, amount) values'+
      ' ($1, $2, $3) returning *',
      values: [orderId, token, amount],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async updatePaymentStatus(paymentId: number, status: string): Promise<boolean> {
    const query = {
      text: 'update payments set transaction_status = $1 where id = $2',
      values: [status, paymentId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async updatePayment(paymentId: number, paymentType: string, status: string): Promise<boolean> {
    const query = {
      text: 'update payments set payment_type = $1, transaction_status = $2, updated_at = $3 where id = $4',
      values: [paymentType, status, new Date(), paymentId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async getPaymentById(paymentId: number): Promise<PaymentDTO | null> {
    const query = {
      text : 'select order_id from payments where id = $1',
      values : [paymentId],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async getPaymentEventById(paymentEventId: number): Promise<PaymentEventDTO | null> {
    const query = {
      text : 'select payment_id, payload from payment_events where id = $1',
      values : [paymentEventId],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }
}

export default PaymentRepository;
