import { CartService } from '../../src/services';
import { CartRepository } from '../../src/repositories';

describe('Cart Service', () => {
  let mockRepository: jest.Mocked<CartRepository>;
  let cartService: CartService;

  const mockCartItem = {
    cart_item_id: 1, coffee_id: 1, name: 'Americano', price: 10000, quantity: 1,
    total_price: 10000, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockRepository = {
      insertIntoCartItem: jest.fn(),
      isCartExist: jest.fn(),
      createCart: jest.fn(),
      updateCartStatus: jest.fn(),
      deleteCart: jest.fn(),
    } as unknown as jest.Mocked<CartRepository>;

    cartService = new CartService(mockRepository);
  });

  describe('addToCart', () => {
    it('should add item to cart',  async () => {
      mockRepository.insertIntoCartItem.mockResolvedValue(mockCartItem);

      const result = await cartService.addToCart(1, 1, 1);

      expect(mockRepository.insertIntoCartItem).toHaveBeenCalledWith(1, 1, 1);
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('isCartExist', () => {
    it('should return true if cart exists', async () => {
      mockRepository.isCartExist.mockResolvedValue({ id: 1 });

      const result = await cartService.isCartExist(1);

      expect(mockRepository.isCartExist).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should return null if cart does not exist', async () => {
      mockRepository.isCartExist.mockResolvedValue(null);

      const result = await cartService.isCartExist(-1);

      expect(mockRepository.isCartExist).toHaveBeenCalledWith(-1);
      expect(result).toEqual(null);
    });
  });

  describe('createCart', () => {
    it('should create a new cart',  async () => {
      mockRepository.createCart.mockResolvedValue({ id: 1 });

      const result = await cartService.createCart(1);

      expect(mockRepository.createCart).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('updateCartStatus', () => {
    it('should return true if cart status update succeeds',  async () => {
      mockRepository.updateCartStatus.mockResolvedValue(true);

      const result = await cartService.updateCartStatus(1);

      expect(mockRepository.updateCartStatus).toHaveBeenCalledWith(1);
      expect(result).toEqual(true);
    });

    it('should return false if cart status update fails', async () => {
      mockRepository.updateCartStatus.mockResolvedValue(false);

      const result = await cartService.updateCartStatus(-1);

      expect(mockRepository.updateCartStatus).toHaveBeenCalledWith(-1);
      expect(result).toEqual(false);
    });
  });

  describe('deleteCart', () => {
    it('should return true if cart deletion succeeds',  async () => {
      mockRepository.deleteCart.mockResolvedValue(true);

      const result = await cartService.deleteCart();

      expect(mockRepository.deleteCart).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });

    it('should return false if cart deletion fails', async () => {
      mockRepository.deleteCart.mockResolvedValue(false);

      const result = await cartService.deleteCart();

      expect(mockRepository.deleteCart).toHaveBeenCalledTimes(1);
      expect(result).toEqual(false);
    });
  });
});