import { PaymentRepository } from '../repositories';
import { ProducerService } from '.';
import { NotFoundError } from '../exceptions';

class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly rabbitMQ:  typeof ProducerService,
  ) {}

  public async createPaymentEvent(orderId: number, eventType: string, payload: object): Promise<void> {
    const payment = await this.paymentRepository.getPaymentByOrderId(orderId);
    if (!payment) {
      throw new NotFoundError('Payment not found!');
    }

    const paymentEvent = await this.paymentRepository.createPaymentEvent(payment.id, eventType, JSON.stringify(payload));

    this.rabbitMQ.sendMessage('payment_event', {
      paymentEventId: paymentEvent.id,
    });
  }
}

export default PaymentService;

/**
 * Create order and transaction also send event to queue
 * Create payment in consumer
 * Costumer pay the payment
 * Midtrans send notification to backend
 * Create payment events and send event to update payment and order status
 * Update payment and order status in consumer
 */