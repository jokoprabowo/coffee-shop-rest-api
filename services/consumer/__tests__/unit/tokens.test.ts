import { RefreshTokenRepository } from '../../src/repositories';
import { RefreshTokenService } from '../../src/services';

describe('RefreshToken Service', () => {
  let mockRepository: jest.Mocked<RefreshTokenRepository>;
  let refreshTokenService: RefreshTokenService;

  beforeEach(() => {
    mockRepository = {
      deleteToken: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    refreshTokenService = new RefreshTokenService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteToken', () => {
    it('should delete the token and return true', async () => {
      mockRepository.deleteToken.mockResolvedValue(true);

      const result = await refreshTokenService.deleteToken();

      expect(mockRepository.deleteToken).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when no token to delete', async () => {
      mockRepository.deleteToken.mockResolvedValue(false);

      const result = await refreshTokenService.deleteToken();

      expect(mockRepository.deleteToken).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });
  });
});