import { NextFunction ,Request, Response } from 'express';
import { verifyMidtransSignature } from '../utils/midtrans';
import { PaymentService } from '../services';
import { ClientError } from '../exceptions';
import config from '../config';

class PaymentController {
  constructor(private readonly paymentService: PaymentService) {
    this.paymentWebhook = this.paymentWebhook.bind(this);
  }

  public async paymentWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { order_id, status_code, gross_amount, signature_key, transaction_type } = req.body;

      const isValid = verifyMidtransSignature({
        order_id, status_code, gross_amount, signature_key
      }, config.SERVER_KEY!);

      if (!isValid) {
        throw new ClientError('Invalid signature key!');
      }
      
      const transaction = await this.paymentService.createPaymentEvent(order_id, transaction_type, req.body);
      res.status(201).json({
        status: 'CREATED',
        message: 'Transaction has been created!',
        data: {
          transaction
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

export default PaymentController;