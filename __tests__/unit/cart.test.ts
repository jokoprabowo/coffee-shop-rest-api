import { NotFoundError } from '../../src/exceptions';
import { CartRepository } from '../../src/repositories';
import { CartService } from '../../src/services';

describe('Cart service', () => {
  let mockRepo: jest.Mocked<CartRepository>;
  let service: CartService;

  const mockCart = { id: 1, user_id: 1, status: 'open' };
  const mockCartItem = { id: 1, cart_id:1, coffee_id:1, quantity: 1 };

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

    service = new CartService(mockRepo);
  });

  describe('Create cart', () => {
    it('Should return cart', async () => {
      mockRepo.isCartExist.mockResolvedValue(false);
      mockRepo.create.mockResolvedValue(mockCart);
      mockRepo.createItem.mockResolvedValue(mockCartItem);
      mockRepo.getCartItems.mockResolvedValue([mockCartItem]);

      const result = await service.addToCart(1, 1, 1);

      expect(mockRepo.isCartExist).toHaveBeenCalledWith(1);
      expect(mockRepo.create).toHaveBeenCalledWith(1);
      expect(mockRepo.createItem).toHaveBeenCalledWith(1, 1, 1);
      expect(mockRepo.getCartItems).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockCartItem]);
    });
  });

  describe('Get cart items', () => {
    it('Should return cart items', async () => {
      mockRepo.isCartExist.mockResolvedValue(mockCart);
      mockRepo.getCartItems.mockResolvedValue([mockCartItem]);

      const result = await service.getCartItems(1);

      expect(mockRepo.isCartExist).toHaveBeenCalledWith(1);
      expect(mockRepo.getCartItems).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockCartItem]);
    });
  });

  describe('Update the quantity of the cart item', () => {
    it('Should return true if cart item from input id exist', async () => {
      mockRepo.updateItem.mockResolvedValue(true);

      const result = await service.updateItem(1, 1);

      expect(mockRepo.updateItem).toHaveBeenCalledWith(1, 1);
      expect(result).toBe(true);
    });

    it('Should return true if cart item from input id exist', async () => {
      mockRepo.updateItem.mockResolvedValue(false);

      await expect(
        service.updateItem(1, 1)
      ).rejects.toThrow(new NotFoundError('Cart item not found!'));
    });
  });

  describe('Delete cart item', () => {
    it('Should return true if cart item from input id exist', async () => {
      mockRepo.deleteItem.mockResolvedValue(true);

      const result = await service.deleteItem(1);

      expect(mockRepo.deleteItem).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('Should return true if cart item from input id exist', async () => {
      mockRepo.deleteItem.mockResolvedValue(false);

      await expect(
        service.deleteItem(1)
      ).rejects.toThrow(new NotFoundError('Cart item not found!'));
    });
  });
});