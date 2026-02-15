import { NextFunction ,Request, Response } from 'express';
import { PaymentService } from '../services';

class PaymentController {
  constructor(private readonly paymentService: PaymentService) {
    this.paymentWebhook = this.paymentWebhook.bind(this);
  }

  public async paymentWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { transaction_type, order_id } = req.body;
      
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