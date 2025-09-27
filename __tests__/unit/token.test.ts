import crypto from 'crypto';
import { NotFoundError } from '../../src/exceptions';
import { RefreshTokenRepository } from '../../src/repositories';
import { RefreshTokenService } from '../../src/services';
import { encryptInput, checkInput } from '../../src/utilities/encrypt';

jest.mock('../../src/utilities/encrypt', () => ({
  encryptInput: jest.fn(),
  checkInput: jest.fn(),
}));
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));
describe('Refresh token service', () => {
  let mockRepo: jest.Mocked<RefreshTokenRepository>;
  let service: RefreshTokenService;

  const mockToken = {
    user_id: 1, selector: 'secectorTest', token: 'hashedToken', device_info: 'Chrome', ip_address: '192.168.1.1',
    is_revokde: false, expires_at: '2025-09-27T15:10:19.525Z'
  };
  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findUserIdBySelector: jest.fn(),
      findActiveToken: jest.fn(),
      revokeToken: jest.fn(),
      revokeAllTokens: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    service = new RefreshTokenService(mockRepo);
    jest.clearAllMocks();
  });

  describe('Create refresh token', () => {
    it('Should return refresh token', async () => {
      mockRepo.create.mockResolvedValue(mockToken);
      (crypto.randomBytes as jest.Mock)
        .mockReturnValueOnce({ toString: () => 'selectorTest' })
        .mockReturnValueOnce({ toString: () => 'tokenTest' });
      (encryptInput as jest.Mock).mockReturnValue('hashedToken');

      const result = await service.generateToken(1, 'Chrome', '192.168.1.1');

      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(encryptInput).toHaveBeenCalledWith('tokenTest');
      expect(result).toBe('selectorTest.tokenTest');
    });
  });
  describe('Find user id by selector', () => {
    it('Should return user id if token with provided selector exist', async () => {
      mockRepo.findUserIdBySelector.mockResolvedValue(mockToken);

      const result = await service.findUserIdBySelector('selectorTest');

      expect(mockRepo.findUserIdBySelector).toHaveBeenCalledWith('selectorTest');
      expect(result).toBe(1);
    });
    it('Should return not found error if token with provided selector does not exist', async () => {
      mockRepo.findUserIdBySelector.mockResolvedValue(null);

      await expect(
        service.findUserIdBySelector('selectorTest')
      ).rejects.toThrow(new NotFoundError('Token not found!'));
    });
  });
  describe('Verify token', () => {
    it('Should return token data if token is valid', async () => {
      mockRepo.findActiveToken.mockResolvedValue(mockToken);
      (checkInput as jest.Mock).mockReturnValue(true);

      const result = await service.verifyToken('selectorTest', 'tokenTest');

      expect(mockRepo.findActiveToken).toHaveBeenCalledWith('selectorTest');
      expect(checkInput).toHaveBeenCalledWith('tokenTest', 'hashedToken');
      expect(result).toBe(mockToken);
    });
    it('Should return false if token is invalid', async () => {
      mockRepo.findActiveToken.mockResolvedValue(mockToken);
      (checkInput as jest.Mock).mockReturnValue(false);

      const result = await service.verifyToken('selectorTest', 'tokenTest');

      expect(mockRepo.findActiveToken).toHaveBeenCalledWith('selectorTest');
      expect(checkInput).toHaveBeenCalledWith('tokenTest', 'hashedToken');
      expect(result).toBe(false);

    });
  });
  describe('Revoke token', () => {
    it('Should return true if revoke token wwith provided selector is successful', async () => {
      mockRepo.revokeToken.mockResolvedValue(true);

      const result = await service.revokeToken('selectorTest');

      expect(mockRepo.revokeToken).toHaveBeenCalledWith('selectorTest');
      expect(result).toBe(true);
    });
    it('Should return not found error if token with provided selector does not exist', async () => {
      mockRepo.revokeToken.mockResolvedValue(false);

      await expect(
        service.revokeToken('selectorTest')
      ).rejects.toThrow(new NotFoundError('Token not found!'));
    });
  });
  describe('Revoke all tokens', () => {
    it('Should return true if revoke all token with provided user id is successful', async () => {
      mockRepo.revokeAllTokens.mockResolvedValue(true);

      const result = await service.revokeAllTokens(1);

      expect(mockRepo.revokeAllTokens).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
    it('Should return false if tokens with provided user id is does not exist', async () => {
      mockRepo.revokeAllTokens.mockResolvedValue(false);

      const result = await service.revokeAllTokens(1);

      expect(mockRepo.revokeAllTokens).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});