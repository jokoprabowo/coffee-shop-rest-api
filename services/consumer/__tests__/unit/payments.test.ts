import { PaymentRepository } from '../../src/repositories';
import { PaymentService } from '../../src/services';

describe('PaymentService', () => {
  let mockRepository: jest.Mocked<PaymentRepository>;
  let paymentService: PaymentService;

  const mockPayment = {
    id: 1, order_id: 1, provider: 'mockProvider', payment_type: 'mockType', token: 'mockToken',
    transaction_status: 'mockStatus', amount: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };

  const mockPaymentEvent = {
    id: 1, payment_id: 1, event_type: 'mockEventType', payload: 'mockPayload', created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      updatePayment: jest.fn(),
      updatePaymentStatus: jest.fn(),
      getPaymentById: jest.fn(),
      getPaymentEventById: jest.fn(),
    } as unknown as jest.Mocked<PaymentRepository>;

    paymentService = new PaymentService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should create a payment and return the payment data', async () => {
      mockRepository.create.mockResolvedValue(mockPayment);

      const result = await paymentService.createPayment(1, 'mockToken', 5);

      expect(mockRepository.create).toHaveBeenCalledWith(1, 'mockToken', 5);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('updatePayment', () => {
    it('should update a payment and return true', async () => {
      mockRepository.updatePayment.mockResolvedValue(true);

      const result = await paymentService.updatePayment(1, 'mockType', 'mockStatus');

      expect(mockRepository.updatePayment).toHaveBeenCalledWith(1, 'mockType', 'mockStatus');
      expect(result).toBe(true);
    });

    it('should fail to update a payment and return false', async () => {
      mockRepository.updatePayment.mockResolvedValue(false);

      const result = await paymentService.updatePayment(1, 'mockType', 'mockStatus');

      expect(mockRepository.updatePayment).toHaveBeenCalledWith(1, 'mockType', 'mockStatus');
      expect(result).toBe(false);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status and return true', async () => {
      mockRepository.updatePaymentStatus.mockResolvedValue(true);

      const result = await paymentService.updatePaymentStatus(1, 'mockStatus');

      expect(mockRepository.updatePaymentStatus).toHaveBeenCalledWith(1, 'mockStatus');
      expect(result).toBe(true);
    });

    it('should fail to update payment status and return false', async () => {
      mockRepository.updatePaymentStatus.mockResolvedValue(false);

      const result = await paymentService.updatePaymentStatus(1, 'mockStatus');

      expect(mockRepository.updatePaymentStatus).toHaveBeenCalledWith(1, 'mockStatus');
      expect(result).toBe(false);
    });
  });

  describe('getPaymentById', () => {
    it('should return payment data for a valid payment Id', async () => {
      mockRepository.getPaymentById.mockResolvedValue(mockPayment);

      const result = await paymentService.getPaymentById(1);

      expect(mockRepository.getPaymentById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPayment);
    });

    it('should return null if payment is not found', async () => {
      mockRepository.getPaymentById.mockResolvedValue(null);

      const result = await paymentService.getPaymentById(1);

      expect(mockRepository.getPaymentById).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('getPaymentEventById', () => {
    it('should return payment event data for a valid payment event Id', async () => {
      mockRepository.getPaymentEventById.mockResolvedValue(mockPaymentEvent);

      const result = await paymentService.getPaymentEventById(1);

      expect(mockRepository.getPaymentEventById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPaymentEvent);
    });

    it('should return null if payment event is not found', async () => {
      mockRepository.getPaymentEventById.mockResolvedValue(null);

      const result = await paymentService.getPaymentEventById(1);

      expect(mockRepository.getPaymentEventById).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });
});