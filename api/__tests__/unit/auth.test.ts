import { AuthService, UserService } from '../../src/services';
import { checkInput } from '../../src/utilities/encrypt';
import { ClientError } from '../../src/exceptions';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('../../src/utilities/encrypt', () => ({
  checkInput: jest.fn(),
}));

describe('Auth Service', () => {
  let userService: jest.Mocked<UserService>;
  let authService: AuthService;

  const mockUser = {
    id: 1, email: 'test@mail.com', password: 'hashedPass', fullname: 'Test Example', 
    phone: '081234567890', address: 'Test street, Example, 00000'
  };

  beforeEach(() => {
    userService = {
      create: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    authService = new AuthService(userService);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
});
