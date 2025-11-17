import crypto from 'crypto';
import { NotFoundError } from '../../src/exceptions';
import { CartRepository, CoffeeRepository } from '../../src/repositories';
import { CartService, CacheService } from '../../src/services';


jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));
describe('Cart service', () => {
  let mockRepo: jest.Mocked<CartRepository>;
  let mockCoffeeRepo: jest.Mocked<CoffeeRepository>;
  let mockCache: jest.Mocked<CacheService>;
  let service: CartService;

  const mockCoffee = { id: 1, name: 'Americano', price: 12000, description: 'bitter coffee', image: 'https://example.com/americano.webdl' };
  const mockCartItem = { cart_item_id: 'cartItemId', coffee_id:1, name: 'Americano', price: 12000, quantity: 1, total_price: 12000 };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      createItem: jest.fn(),
      isCartExist: jest.fn(),
      getCartItems: jest.fn(),
      updateStatus: jest.fn(),
      updateItem: jest.fn(),
      deleteItem: jest.fn(),
    } as unknown as jest.Mocked<CartRepository>;

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<CacheService>;

    mockCoffeeRepo = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<CoffeeRepository>;

    service = new CartService(mockRepo, mockCache, mockCoffeeRepo);
  });

  describe('Create cart', () => {
    it('Should return cart', async () => {
      mockCoffeeRepo.findOne.mockResolvedValue(mockCoffee);
      (crypto.randomBytes as jest.Mock).mockReturnValueOnce({ toString: () => 'cartItemId' });
      mockCache.get.mockResolvedValue(null);

      const result = await service.addToCart(1, 1, 1);
      
      expect(mockCoffeeRepo.findOne).toHaveBeenCalledWith(1);
      expect(mockCache.get).toHaveBeenCalledTimes(1);
      expect(result[0].name).toBe('Americano');
    });
  });

  describe('Get cart items', () => {
    it('Should return cart items by cache', async () => {
      mockCache.get.mockResolvedValue(JSON.stringify([mockCartItem]));
      const mockParse = jest.spyOn(JSON, 'parse').mockImplementation(() => ([mockCartItem]));

      const result = await service.getCartItems(1);

      expect(mockCache.get).toHaveBeenCalledWith('cart:1');
      expect(result).toEqual({ cartItems: [mockCartItem], source: 'cache' });
      mockParse.mockRestore();
    });

    it('Should return cart items by database', async () => {
      mockCache.get.mockResolvedValue(null);
      mockRepo.getCartItems.mockResolvedValue([mockCartItem]);

      const result = await service.getCartItems(1);

      expect(mockCache.get).toHaveBeenCalledWith('cart:1');
      expect(result).toEqual({ cartItems: [mockCartItem], source: 'database' });
    });
  });

  describe('Update the quantity of the cart item', () => {
    it('Should return true if cart item from input id exist', async () => {
      mockRepo.updateItem.mockResolvedValue(true);

      const result = await service.updateItem(1, 1, 1);

      expect(mockRepo.updateItem).toHaveBeenCalledWith(1, 1);
      expect(result).toBe(true);
    });

    it('Should return true if cart item from input id exist', async () => {
      mockRepo.updateItem.mockResolvedValue(false);

      await expect(
        service.updateItem(1, 1, 1)
      ).rejects.toThrow(new NotFoundError('Cart item not found!'));
    });
  });

  describe('Delete cart item', () => {
    it('Should return true if cart item from input id exist', async () => {
      mockRepo.deleteItem.mockResolvedValue(true);

      const result = await service.deleteItem(1, 1);

      expect(mockRepo.deleteItem).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('Should return true if cart item from input id exist', async () => {
      mockRepo.deleteItem.mockResolvedValue(false);

      await expect(
        service.deleteItem(1, 1)
      ).rejects.toThrow(new NotFoundError('Cart item not found!'));
    });
  });
});