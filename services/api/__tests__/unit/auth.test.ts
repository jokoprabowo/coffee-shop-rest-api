import { AuthService, UserService, ProducerService } from '../../src/services';
import { UserTokenRepository } from '../../src/repositories';
import { checkInput } from '../../src/utilities/encrypt';
import { ClientError } from '../../src/exceptions';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

jest.mock('bcrypt');
jest.mock('../../src/utilities/encrypt', () => ({
  checkInput: jest.fn(),
}));
jest.mock('node:crypto');

describe('Auth Service', () => {
  let userTokenRepository: jest.Mocked<UserTokenRepository>;
  let producerService: jest.Mocked<typeof ProducerService>;
  let userService: jest.Mocked<UserService>;
  let authService: AuthService;

  const mockUser = {
    id: 1, email: 'test@mail.com', password: 'hashedPass', fullname: 'Test Example', 
    phone: '081234567890', address: 'Test street, Example, 00000'
  };

  const mockUserToken = {
    user_id: 1,
    token: 'hashedSampleToken',
    type: 'PASSWORD_RESET',
    expires_at: expect.any(String),
  };

  beforeEach(() => {
    userService = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    userTokenRepository = {
      create: jest.fn(),
      findByToken: jest.fn(),
      updateUsedAt: jest.fn(),
      deleteByUserId: jest.fn(),
    } as unknown as jest.Mocked<UserTokenRepository>;

    producerService = {
      sendMessage: jest.fn(),
    } as unknown as jest.Mocked<typeof ProducerService>;

    authService = new AuthService(userService, userTokenRepository, producerService);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (crypto.randomBytes as jest.Mock).mockReturnValue({ toString: jest.fn().mockReturnValue('randomTokenValue') });
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(), digest: jest.fn().mockReturnValue('hashedSampleToken')
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Register', () => {
    it('Should return user if register with unused data', async () => {
      userService.create.mockResolvedValue(mockUser);

      const result = await authService.register({
        email: 'test@mail.com', password: 'testExample!123', fullname: 'Test Example', phone: '081234567890',
        address: 'Test street, Example, 00000' 
      });

      expect(userService.create).toHaveBeenCalledWith({
        email: 'test@mail.com', password: 'testExample!123', fullname: 'Test Example', phone: '081234567890',
        address: 'Test street, Example, 00000' 
      });
      expect(result).toBe(mockUser);
    });
  });

  describe('Login', () => {
    it('Should return user if login with correct input data', async () => {
      userService.findOne.mockResolvedValue(mockUser);
      (checkInput as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ email: 'test@mail.com', password: 'testExample!123' });

      expect(userService.findOne).toHaveBeenCalledWith('test@mail.com');
      expect(checkInput).toHaveBeenCalledWith('testExample!123','hashedPass');
      expect(result).toBe(mockUser);
    });

    it('Should return ClientError if login with incorrect input data', async () => {
      userService.findOne.mockResolvedValue(mockUser);
      (checkInput as jest.Mock).mockResolvedValue( false);

      await expect(
        authService.login({ email: 'test@mail.com', password: 'falsePassword!123' })
      ).rejects.toThrow(new ClientError('Password invalid!'));
    });
  });

  describe('Find By Email', () => {
    it('Should return user if email exists', async () => {
      userService.findOne.mockResolvedValue(mockUser);

      const result = await authService.findByEmail(mockUser.email);

      expect(userService.findOne).toHaveBeenCalledWith(mockUser.email);
      expect(result).toBe(mockUser);
    });
  });

  describe('Update Used At', () => {
    it('Should return true if update used at token successfully', async () => {
      userTokenRepository.updateUsedAt.mockResolvedValue(true);

      const result = await authService.updateUsedAt('sampleToken');

      expect(userTokenRepository.updateUsedAt).toHaveBeenCalledWith('sampleToken');
      expect(result).toBe(true);
    });

    it('Should return false if update used at token fails', async () => {
      userTokenRepository.updateUsedAt.mockResolvedValue(false);

      const result = await authService.updateUsedAt('sampleToken');

      expect(userTokenRepository.updateUsedAt).toHaveBeenCalledWith('sampleToken');
      expect(result).toBe(false);
    });
  });

  describe('Create User Token', () => {
    it('Should create user token and send message successfully', async () => {
      userService.findById.mockResolvedValue(mockUser);

      const result = await authService.createUserToken(1, 'PASSWORD_RESET');

      expect(result).toBe('randomTokenValue');
      expect(userTokenRepository.create).toHaveBeenCalledTimes(1);
      expect(userTokenRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(mockUserToken)
      );
      expect(userService.findById).toHaveBeenCalledWith(1);
      expect(producerService.sendMessage).toHaveBeenCalledWith('PASSWORD_RESET',
        expect.objectContaining({
          email: mockUser.email,
          fullname: mockUser.fullname,
          token: 'randomTokenValue',
          expiresAt: expect.any(String),
        })
      );
    });
  });

  describe('Reset Password', () => {
    it('Should reset password successfully', async () => {
      jest
        .spyOn(authService, 'verifyToken')
        .mockResolvedValue({ user_id: 1, token: 'hashedSampleToken', type: 'PASSWORD_RESET', expires_at: new Date().toISOString() });

      await authService.resetPassword('sampleToken', 'newPassword!123');

      expect(authService.verifyToken).toHaveBeenCalledWith('sampleToken');
      expect(userService.update).toHaveBeenCalledWith(expect.any(Number), { password: 'newPassword!123' });
    });
  });

  describe('Verify Token', () => {
    it('Should return user token data if token is valid', async () => {
      userTokenRepository.findByToken.mockResolvedValue(mockUserToken);


      const result = await authService.verifyToken('sampleToken');

      expect(userTokenRepository.findByToken).toHaveBeenCalledWith('hashedSampleToken');
      expect(result).toBe(mockUserToken);
    });

    it('Should throw ClientError if token is invalid', async () => {
      userTokenRepository.findByToken.mockResolvedValue(null);
      await expect(
        authService.verifyToken('invalidToken')
      ).rejects.toThrow(new ClientError('Invalid or expired token'));
    });
  });
});
