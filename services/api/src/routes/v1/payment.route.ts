import { Router } from 'express';
import { pool } from '@project/shared';
import { PaymentRepository } from '../../repositories';
import { PaymentService, ProducerService } from '../../services';
import { PaymentController } from '../../controllers';

const paymentRepository = new PaymentRepository(pool);

const paymentService = new PaymentService(paymentRepository, ProducerService);

const paymentController = new PaymentController(paymentService);

const router = Router();

router.post('/webhook', paymentController.paymentWebhook);

export default router;
