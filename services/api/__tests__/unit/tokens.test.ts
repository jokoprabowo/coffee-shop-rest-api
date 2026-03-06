import crypto from 'node:crypto';
import { ClientError, NotFoundError } from '../../src/exceptions';
import { RefreshTokenRepository } from '../../src/repositories';
import { RefreshTokenService } from '../../src/services';
import { encryptInput, checkInput } from '@project/shared';

jest.mock('@project/shared', () => ({
  encryptInput: jest.fn(),
  checkInput: jest.fn(),
}));
jest.mock('node:crypto');

describe('Refresh token service', () => {
  let mockRepo: jest.Mocked<RefreshTokenRepository>;
  let service: RefreshTokenService;

  const mockTokenData = {
    user_id: 1, selector: 'secectorTest', token: 'hashedToken', device_info: 'Chrome', ip_address: '192.168.1.1',
    is_revokde: false, expires_at: '2025-09-27T15:10:19.525Z'
  };

  const mockSelector = 'selectorTokenTest';
  const mockToken = 'tokenTest';
  const mockHashedToken = 'hashedToken';

  beforeEach(() => {
    (crypto.randomBytes as jest.Mock)
      .mockReturnValueOnce({ toString: () => mockSelector })
      .mockReturnValueOnce({ toString: () => mockToken });

    (encryptInput as jest.Mock).mockResolvedValue(mockHashedToken);

    mockRepo = {
      create: jest.fn(),
      findUserIdBySelector: jest.fn(),
      findActiveToken: jest.fn(),
      revokeToken: jest.fn(),
      revokeAllTokens: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    service = new RefreshTokenService(mockRepo);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Create refresh token', () => {
    it('Should return refresh token', async () => {
      const result = await service.generateToken(1, 'Chrome', '192.168.1.1');
      mockRepo.create.mockResolvedValue(mockTokenData);

      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(encryptInput).toHaveBeenCalledWith(mockToken);
      expect(result).toBe(mockSelector+'.'+ mockToken);
    });
  });
  describe('Find user id by selector', () => {
    it('Should return user id if token with provided selector exist', async () => {
      mockRepo.findUserIdBySelector.mockResolvedValue(mockTokenData);

      const result = await service.findUserIdBySelector(mockSelector);

      expect(mockRepo.findUserIdBySelector).toHaveBeenCalledWith(mockSelector);
      expect(result).toBe(1);
    });
    it('Should return not found error if token with provided selector does not exist', async () => {
      mockRepo.findUserIdBySelector.mockResolvedValue(null);

      await expect(
        service.findUserIdBySelector(mockSelector)
      ).rejects.toThrow(new NotFoundError('Token not found!'));
    });
  });
  describe('Verify token', () => {
    it('Should return token data if token is valid', async () => {
      mockRepo.findActiveToken.mockResolvedValue(mockTokenData);
      (checkInput as jest.Mock).mockReturnValue(true);

      const result = await service.verifyToken(mockSelector, mockToken);

      expect(mockRepo.findActiveToken).toHaveBeenCalledWith(mockSelector);
      expect(checkInput).toHaveBeenCalledWith(mockToken, mockHashedToken);
      expect(result).toBe(mockTokenData);
    });
    it('Should return client error if token is invalid', async () => {
      mockRepo.findActiveToken.mockResolvedValue(mockTokenData);
      (checkInput as jest.Mock).mockReturnValue(false);

      await expect(
        service.verifyToken(mockSelector, mockToken)
      ).rejects.toThrow( new ClientError('Invalid refresh token!'));

    });
  });
  describe('Revoke token', () => {
    it('Should return true if revoke token wwith provided selector is successful', async () => {
      mockRepo.revokeToken.mockResolvedValue(true);

      const result = await service.revokeToken(mockSelector);

      expect(mockRepo.revokeToken).toHaveBeenCalledWith(mockSelector);
      expect(result).toBe(true);
    });
    it('Should return not found error if token with provided selector does not exist', async () => {
      mockRepo.revokeToken.mockResolvedValue(false);

      await expect(
        service.revokeToken(mockSelector)
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