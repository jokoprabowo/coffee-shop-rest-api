import { NotFoundError } from '../../src/exceptions';
import { OrderRepository, CartRepository } from '../../src/repositories';
import { OrderService, CacheService } from '../../src/services';

describe('Order service', () => {
  let mockCartRepo: jest.Mocked<CartRepository>;
  let mockOrderRepo: jest.Mocked<OrderRepository>;
  let mockCache: jest.Mocked<CacheService>;
  let service: OrderService;

  const mockCart = { id: 1, user_id: 1, status: 'open' };
  const mockCartItem = { cart_item_id: 'cartItemId', coffee_id:1, name: 'Americano', price: 12000, quantity: 1, total_price: 12000 };
  const mockOrder = { id: 1, user_id: 1, status: 'pending', total: 1 };
  const mockOrderItem = { id: 1, order_id: 1, coffee_id: 1, name: 'Americano', quantity: 1, unit_price: 15000, total_price: 15000 };

  beforeEach(() => {
    mockCartRepo = {
      isCartExist: jest.fn(),
      getCartItems: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<CartRepository>;

    mockOrderRepo = {
      createOrder: jest.fn(),
      createOrderItem: jest.fn(),
      getOrderList: jest.fn(),
      getOrderDetails: jest.fn(),
      updateStatus: jest.fn(),
      deleteOrder: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<CacheService>;

    service = new OrderService(mockOrderRepo, mockCartRepo, mockCache);
  });

  describe('Create order', () => {
    it('Should return order if there is at least an item in the cart on database', async () => {
      mockCartRepo.isCartExist.mockResolvedValue(mockCart);
      mockCartRepo.getCartItems.mockResolvedValue([mockCartItem]);
      mockOrderRepo.createOrder.mockResolvedValue(mockOrder);

      const result = await service.createOrder(1);

      expect(mockCartRepo.isCartExist).toHaveBeenCalledWith(1);
      expect(mockCartRepo.getCartItems).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.createOrder).toHaveBeenCalledWith(1,1);
      expect(result).toBe(mockOrder);
    });

    it('Should return order if there is at least an item in the cart on cache', async () => {
      mockCache.get.mockResolvedValue(JSON.stringify([mockCartItem]));
      const mockParse = jest.spyOn(JSON, 'parse').mockImplementation(() => ([mockCartItem]));
      mockOrderRepo.createOrder.mockResolvedValue(mockOrder);

      const result = await service.createOrder(1);

      expect(mockCache.get).toHaveBeenCalledWith('cart:1');
      expect(mockOrderRepo.createOrder).toHaveBeenCalledWith(1,1);
      expect(result).toBe(mockOrder);
      mockParse.mockRestore();
    });

    it('Should return not found error if there is no item in the cart', async () => {
      mockCache.get.mockResolvedValue(null);
      mockCartRepo.isCartExist.mockResolvedValue(null);

      await expect(
        service.createOrder(1)
      ).rejects.toThrow(new NotFoundError('Cart is empty!'));
      expect(mockCartRepo.isCartExist).toHaveBeenCalledWith(1);
    });
  });

  describe('Get order list', () => {
    it('Should return list of order', async () => {
      mockOrderRepo.getOrderList.mockResolvedValue([mockOrder]);

      const result = await service.getOrderList(1);

      expect(mockOrderRepo.getOrderList).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('Get order details', () => {
    it('Should return order details', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([mockOrderItem]);

      const result = await service.getOrderDetails(1);

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockOrderItem]);
    });
  });

  describe('Update order status', () => {
    it('Should return true if update successfull', async () => {
      mockOrderRepo.updateStatus.mockResolvedValue(true);

      const result = await service.updateStatus(1, 'paid');

      expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith(1, 'paid');
      expect(result).toBe(true);
    });

    it('Should return not found error if order is not exist', async () => {
      mockOrderRepo.updateStatus.mockResolvedValue(false);

      await expect(
        service.updateStatus(1, 'paid')
      ).rejects.toThrow(new NotFoundError('Order not found!'));
      expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith(1, 'paid');
    });
  });

  describe('Delete order', () => {
    it('Should return true if delete successfull', async () => {
      mockOrderRepo.deleteOrder.mockResolvedValue(true);

      const result = await service.deleteOrder(1);

      expect(mockOrderRepo.deleteOrder).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('Should return not found error if order is not exist', async () => {
      mockOrderRepo.deleteOrder.mockResolvedValue(false);

      await expect(
        service.deleteOrder(1)
      ).rejects.toThrow(new NotFoundError('Order not found!'));
      expect(mockOrderRepo.deleteOrder).toHaveBeenCalledWith(1);
    });
  });
});