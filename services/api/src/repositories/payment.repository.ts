import { Pool } from 'pg';
import { PaymentDTO, PaymentEventDTO } from '../dto';

class PaymentRepository {
  constructor (private readonly database: Pool) {}

  public async createPaymentEvent(paymentId: number, eventType: string, payload: string): Promise<PaymentEventDTO> {
    const query = {
      text: 'insert into payment_events (payment_id, event_type, payload_hash) values ($1, $2, $3) returning *',
      values: [paymentId, eventType, payload],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async getPaymentByOrderId(orderId: number): Promise<PaymentDTO | null> {
    const query = {
      text: 'select id from payments where order_id = $1',
      values: [orderId],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }
}

export default PaymentRepository;
