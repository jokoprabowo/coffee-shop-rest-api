import { PaymentRepository } from '../repositories';
import { PaymentDTO, PaymentEventDTO } from '../dto';

class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository){}

  public async createPayment(orderId: number, token: string, amount: number): Promise<PaymentDTO> {
    return this.paymentRepository.create(orderId, token, amount);
  }

  public async updatePayment(paymentId: number, paymentType: string, status: string): Promise<boolean> {
    return await this.paymentRepository.updatePayment(paymentId, paymentType, status);
  }

  public async updatePaymentStatus(paymentId: number, status: string): Promise<boolean> {
    return await this.paymentRepository.updatePaymentStatus(paymentId, status);
  }

  public async getPaymentById(paymentId: number): Promise<PaymentDTO | null> {
    return this.paymentRepository.getPaymentById(paymentId);
  }

  public async getPaymentEventById(paymentEventId: number): Promise<PaymentEventDTO | null> {
    return this.paymentRepository.getPaymentEventById(paymentEventId);
  }

  public async deletePaymentEvent(): Promise<boolean> {
    return this.paymentRepository.deletePaymentEvent();
  }
}

export default PaymentService;
