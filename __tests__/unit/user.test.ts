import { UserRepository } from '../../src/repositories';
import { UserService } from '../../src/services';
import { userRole } from '../../src/dto';
import { encryptPassword } from '../../src/utilities/encrypt';
import { AuthorizationError, ConflictError, NotFoundError } from '../../src/exceptions';

jest.mock('../../src/utilities/encrypt', () => ({
  encryptPassword: jest.fn(),
}));
describe('User service', () => {
  let mockRepository: jest.Mocked<UserRepository>;
  let service: UserService;

  const mockUser = {
    email: 'test@mail.com', password: 'hashedPass', fullname: 'Test Example', 
    phone: '081234567890', address: 'Test street, Example, 00000'
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    service = new UserService(mockRepository);
  });

  describe('Create', () => {
    it('Should return user if create a user with unused user data', async () => {
      mockRepository.create.mockResolvedValue(mockUser);
      mockRepository.findOne.mockResolvedValue(null);
      (encryptPassword as jest.Mock).mockReturnValue('hashedPass');

      const result = await service.create({
        email: 'test@mail.com', password: 'testExample!123', fullname: 'Test Example', 
        phone: '081234567890', address: 'Test street, Example, 00000'
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith('test@mail.com');
      expect(encryptPassword).toHaveBeenCalledWith('testExample!123');
      expect(mockRepository.create).toHaveBeenCalledWith(result);
      expect(result).toBe(mockUser);
    });

    it('Should return authorization error if create a user with admin role with email that is not whitelisted', async () => {
      await expect(
        service.create({
          email: 'test@mail.com', password: 'hashedPass', fullname: 'Test Example', 
          phone: '081234567890', address: 'Test street, Example, 00000', role: userRole.ADMIN
        })
      ).rejects.toThrow(new AuthorizationError('You are not allowed to register as an admin!'));
    });

    it('Should return conflict error if create a user with used user data', async ()=> {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          email: 'test@mail.com', password: 'hashedPass', fullname: 'Test Example', 
          phone: '081234567890', address: 'Test street, Example, 00000'
        })
      ).rejects.toThrow(new ConflictError('Email already in used!'));
    });
  });

  describe('Get all users', () => {
    it('Should return list of users', async () => {
      mockRepository.findAll.mockResolvedValue([mockUser]);

      const results = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(results).toEqual([mockUser]);
    });
  });

  describe('Get user details', () => {
    it('Should return user with correct email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('test@mail.com');

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockUser);
    });

    it('Should return not found error with incorrect email', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('wrong@mail.com')
      ).rejects.toThrow(new NotFoundError('User not found!'));
    });

    it('Should return user with correct id', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockUser);
    });

    it('Should return not found error with incorrect email', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.findById(0)
      ).rejects.toThrow(new NotFoundError('User not found!'));
    });
  });

  describe('Update user', () => {
    it('Should return user if update user with correct update data', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(mockUser);

      const result = await service.update(1, mockUser);

      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockUser);
    });

    it('Should return not found error if using incorrect user id', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(1, mockUser)
      ).rejects.toThrow(new NotFoundError('User not found!'));
    });
  });

  describe('Delete user', () => {
    it('Should return true if delete user with correct user id', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('Should return not found error if using incorrect user id', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(
        service.delete(1)
      ).rejects.toThrow(new NotFoundError('User not found!'));
    });
  });
});
