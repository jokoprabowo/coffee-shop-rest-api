import { OrderRepository } from '../../src/repositories';
import { OrderService } from '../../src/services';

describe('OrderService', () => {
  let mockRepository: jest.Mocked<OrderRepository>;
  let orderService: OrderService;

  beforeEach(() => {
    mockRepository = {
      updateOrderStatus: jest.fn(),
      deletePaidOrder: jest.fn(),
      deleteUnpaidOrder: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    orderService = new OrderService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('deleteUnpaidOrder', () => {
    it('should delete unpaid orders and return true', async () => {
      mockRepository.deleteUnpaidOrder.mockResolvedValue(true);

      const result = await orderService.deleteUnpaidOrder();

      expect(mockRepository.deleteUnpaidOrder).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when no unpaid orders to delete', async () => {
      mockRepository.deleteUnpaidOrder.mockResolvedValue(false);

      const result = await orderService.deleteUnpaidOrder();

      expect(mockRepository.deleteUnpaidOrder).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });
  });

  describe('deletePaidOrder', () => {
    it('should delete paid orders and return true', async () => {
      mockRepository.deletePaidOrder.mockResolvedValue(true);

      const result = await orderService.deletePaidOrder();

      expect(mockRepository.deletePaidOrder).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when no paid orders to delete', async () => {
      mockRepository.deletePaidOrder.mockResolvedValue(false);

      const result = await orderService.deletePaidOrder();

      expect(mockRepository.deletePaidOrder).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status and return true', async () => {
      mockRepository.updateOrderStatus.mockResolvedValue(true);

      const result = await orderService.updateOrderStatus(1, 'paid');

      expect(mockRepository.updateOrderStatus).toHaveBeenCalledWith(1, 'paid');
      expect(result).toBe(true);
    });

    it('should return false when order status update fails', async () => {
      mockRepository.updateOrderStatus.mockResolvedValue(false);

      const result = await orderService.updateOrderStatus(1, 'failed');

      expect(mockRepository.updateOrderStatus).toHaveBeenCalledWith(1, 'failed');
      expect(result).toBe(false);
    });
  });
});