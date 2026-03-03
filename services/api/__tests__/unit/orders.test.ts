import { Database } from '@project/shared';
import { midtransSnap } from '../../src/config/midtrans';
import { AuthorizationError, NotFoundError } from '../../src/exceptions';
import { OrderRepository, CartRepository, UserRepository } from '../../src/repositories';
import { OrderService, CacheService, ProducerService } from '../../src/services';

describe('Order service', () => {
  let db: jest.Mocked<Database>;
  let mockCartRepo: jest.Mocked<CartRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockOrderRepo: jest.Mocked<OrderRepository>;
  let mockCache: jest.Mocked<CacheService>;
  let mockMidtransSnap: jest.Mocked<typeof midtransSnap>;
  let mockMQ: jest.Mocked<typeof ProducerService>;
  let service: OrderService;

  const mockUser = {
    id: 1, email: 'test@mail.com', password: 'hashedPass', fullname: 'Test Example', 
    phone: '081234567890', address: 'Test street, Example, 00000'
  };
  const mockCart = { id: 1, user_id: 1, status: 'open' };
  const mockCartItem = { cart_item_id: 'cartItemId', coffee_id:1, name: 'Americano', price: 12000, quantity: 1, total_price: 12000 };
  const mockOrder = { id: 1, user_id: 1, status: 'pending', total: 1 };
  const mockOrderItem = { id: 1, order_id: 1, coffee_id: 1, name: 'Americano', quantity: 1, unit_price: 15000, total_price: 15000 };
  const mockTransaction = { redirect_url: 'http://payment-test.url', token: 'sampleToken' };

  beforeEach(() => {
    db = {
      withTransaction: jest.fn().mockImplementation(async (fn) => fn()),
    } as unknown as jest.Mocked<Database>;

    mockCartRepo = {
      isCartExist: jest.fn(),
      getCartItems: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<CartRepository>;

    mockUserRepo = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    mockOrderRepo = {
      createOrder: jest.fn(),
      createOrderItem: jest.fn(),
      getOrderList: jest.fn(),
      getOrderDetails: jest.fn(),
      updateStatus: jest.fn(),
      deleteOrder: jest.fn(),
      verifyOrderOwnership: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as unknown as jest.Mocked<CacheService>;

    mockMidtransSnap = {
      createTransaction: jest.fn(),
    } as unknown as jest.Mocked<typeof midtransSnap>;

    mockMQ = {
      sendMessage: jest.fn(),
    } as unknown as jest.Mocked<typeof ProducerService>;

    service = new OrderService(db, mockOrderRepo, mockUserRepo, mockCartRepo, mockCache, mockMQ, mockMidtransSnap);
  });

  describe('Create order', () => {
    it('Should return order if there is at least an item in the cart on database', async () => {
      mockCartRepo.isCartExist.mockResolvedValue(mockCart);
      mockCartRepo.getCartItems.mockResolvedValue([mockCartItem]);
      mockOrderRepo.createOrder.mockResolvedValue(mockOrder);

      const result = await service.createOrder(1);

      expect(db.withTransaction).toHaveBeenCalledTimes(1);
      expect(mockCartRepo.isCartExist).toHaveBeenCalledWith(1);
      expect(mockCartRepo.getCartItems).toHaveBeenCalledWith(1);
      expect(mockCache.del).toHaveBeenCalledWith('cart:1');
      expect(mockMQ.sendMessage).toHaveBeenCalledWith('checkout', { cartItems: [mockCartItem], userId: 1 });
      expect(mockOrderRepo.createOrder).toHaveBeenCalledWith(1,1);
      expect(result).toBe(mockOrder);
    });

    it('Should return order if there is at least an item in the cart on cache', async () => {
      mockCache.get.mockResolvedValue(JSON.stringify([mockCartItem]));
      const mockParse = jest.spyOn(JSON, 'parse').mockImplementation(() => ([mockCartItem]));
      mockOrderRepo.createOrder.mockResolvedValue(mockOrder);

      const result = await service.createOrder(1);

      expect(db.withTransaction).toHaveBeenCalledTimes(1);
      expect(mockCache.get).toHaveBeenCalledWith('cart:1');
      expect(mockCache.del).toHaveBeenCalledWith('cart:1');
      expect(mockMQ.sendMessage).toHaveBeenCalledWith('checkout', { cartItems: [mockCartItem], userId: 1 });
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
      expect(db.withTransaction).toHaveBeenCalledTimes(1);
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
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(true);

      const result = await service.getOrderDetails(1, 1);

      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockOrderItem]);
    });

    it('Should return unauthorized error if user is not the owner of the order', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([mockOrderItem]);
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(false);

      await expect(
        service.getOrderDetails(1, 1)
      ).rejects.toThrow(new AuthorizationError('You are not authorized to access this order!'));

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
    });

    it('Should return not found error if order is not exist', async () => {
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(true);
      mockOrderRepo.getOrderDetails.mockResolvedValue([]);

      await expect(
        service.getOrderDetails(1, 1)
      ).rejects.toThrow(new NotFoundError('Order not found!'));

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
    });
  });

  describe('Update order status', () => {
    it('Should return true if update successfull', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([mockOrderItem]);
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(true);
      mockOrderRepo.updateStatus.mockResolvedValue(true);

      const result = await service.updateStatus(1, 'paid', 1);

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
      expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith(1, 'paid');
      expect(result).toBe(true);
    });

    it('Should return unauthorized error if user is not the owner of the order', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([mockOrderItem]);
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(false);

      await expect(
        service.updateStatus(1, 'paid', 1)
      ).rejects.toThrow(new AuthorizationError('You are not authorized to access this order!'));

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
      expect(mockOrderRepo.updateStatus).not.toHaveBeenCalled();
    });

    it('Should return not found error if order is not exist', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([]);

      await expect(
        service.updateStatus(1, 'paid', 1)
      ).rejects.toThrow(new NotFoundError('Order not found!'));

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
    });
  });

  describe('Delete order', () => {
    it('Should return true if delete successfull', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([mockOrderItem]);
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(true);
      mockOrderRepo.deleteOrder.mockResolvedValue(true);

      const result = await service.deleteOrder(1, 1);

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
      expect(mockOrderRepo.deleteOrder).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('Should return unauthorized error if user is not the owner of the order', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([mockOrderItem]);
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(false);

      await expect(
        service.deleteOrder(1, 1)
      ).rejects.toThrow(new AuthorizationError('You are not authorized to access this order!'));

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
      expect(mockOrderRepo.deleteOrder).not.toHaveBeenCalled();
    });

    it('Should return not found error if order is not exist', async () => {
      mockOrderRepo.getOrderDetails.mockResolvedValue([]);

      await expect(
        service.deleteOrder(1, 1)
      ).rejects.toThrow(new NotFoundError('Order not found!'));

      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).not.toHaveBeenCalled();
      expect(mockOrderRepo.deleteOrder).not.toHaveBeenCalled();
    });
  });

  describe('Create transaction', () => {
    it('Should create transaction and send message to rabbitMQ', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockOrderRepo.getOrderDetails.mockResolvedValue([mockOrderItem]);
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(true);
      mockMidtransSnap.createTransaction.mockResolvedValue(mockTransaction);

      const result = await service.createTransaction(1, 1);
      
      expect(mockUserRepo.findById).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
      expect(mockOrderRepo.getOrderDetails).toHaveBeenCalledWith(1);
      expect(mockMidtransSnap.createTransaction).toHaveBeenCalledTimes(1);
      expect(mockMQ.sendMessage).toHaveBeenCalledWith('create_payment', {
        orderId: 1,
        transaction_token: mockTransaction.token,
        amount: mockOrderItem.total_price,
      });
      expect(result).toBe(mockTransaction);
    });

    it('Should return not found error if user is not exist', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(
        service.createTransaction(1,1)
      ).rejects.toThrow(new NotFoundError('User not found!'));

      expect(mockUserRepo.findById).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).not.toHaveBeenCalled();
      expect(mockMidtransSnap.createTransaction).not.toHaveBeenCalled();
    });

    it('Should return unauthorized error if user is not the owner of the order', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockOrderRepo.verifyOrderOwnership.mockResolvedValue(false);

      await expect(
        service.createTransaction(1, 1)
      ).rejects.toThrow(new AuthorizationError('You are not authorized to access this order!'));

      expect(mockUserRepo.findById).toHaveBeenCalledWith(1);
      expect(mockOrderRepo.verifyOrderOwnership).toHaveBeenCalledWith(1, 1);
      expect(mockMidtransSnap.createTransaction).not.toHaveBeenCalled();
    });
  });
});