import { UserRepository } from '../../src/repositories';
import { UserService } from '../../src/services';

describe('User Service', () => {
  let mockRepository: jest.Mocked<UserRepository>;
  let userService: UserService;

  beforeEach(() => { 
    mockRepository = {
      isUserExist: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isUserExist', () => {
    it('should return true when user exists', async () => {
      mockRepository.isUserExist.mockResolvedValue(true);

      const result = await userService.isUserExist(1);

      expect(mockRepository.isUserExist).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should return false when user does not exists', async () => {
      mockRepository.isUserExist.mockResolvedValue(false);

      const result = await userService.isUserExist(1);

      expect(mockRepository.isUserExist).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});
