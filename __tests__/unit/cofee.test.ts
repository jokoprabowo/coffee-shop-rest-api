import { NotFoundError } from '../../src/exceptions';
import { CoffeeRepository } from '../../src/repositories';
import { CoffeeService } from '../../src/services';

describe('Coffee service', () => {
  let mockRepo: jest.Mocked<CoffeeRepository>;
  let service: CoffeeService;

  const mockCoffee = {
    id: 1, name: 'Americano', price: '12000', description: 'Coffee made by mixing espresso with hot water.',
    image: 'https://www.example.com/americano.png',
  };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CoffeeRepository>;

    service = new CoffeeService(mockRepo);
  });

  describe('Create coffee', () => {
    it('Should return coffee', async () => {
      mockRepo.create.mockResolvedValue(mockCoffee);

      const result = await service.create(mockCoffee);
      
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.create).toHaveBeenCalledWith(mockCoffee);
      expect(result).toBe(mockCoffee);
    });
  });

  describe('Get all coffees', () => {
    it('Should return all coffee data', async () => {
      mockRepo.findAll.mockResolvedValue([mockCoffee]);

      const result = await service.findAll();

      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockCoffee]);
    });
  });

  describe('Get coffee details', () => {
    it('Should return coffee data with correct id', async () => {
      mockRepo.findOne.mockResolvedValue(mockCoffee);

      const result = await service.findOne('1');

      expect(mockRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepo.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCoffee);
    });

    it('Should return not found error with wrong id', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('1')
      ).rejects.toThrow(new NotFoundError('Coffee not found!'));
    });
  });

  describe('Update coffee', () => {
    it('Should return coffee if update with correct id and update data', async () => {
      mockRepo.findOne.mockResolvedValue(mockCoffee);
      mockRepo.update.mockResolvedValue(mockCoffee);

      const result = await service.update('1', mockCoffee);

      expect(mockRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepo.findOne).toHaveBeenCalledWith('1');
      expect(mockRepo.update).toHaveBeenCalledTimes(1);
      expect(mockRepo.update).toHaveBeenCalledWith('1', mockCoffee);
      expect(result).toEqual(mockCoffee);
    });

    it('Should return not found error if update with wrong id', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('1', mockCoffee)
      ).rejects.toThrow(new NotFoundError('Coffee not found!'));
    });
  });

  describe('Delete coffee', () => {
    it('Should return true if delete with correct id', async () => {
      mockRepo.findOne.mockResolvedValue(mockCoffee);
      mockRepo.delete.mockResolvedValue(true);

      const result = await service.delete('1');

      expect(mockRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepo.findOne).toHaveBeenCalledWith('1');
      expect(mockRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockRepo.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual(true);
    });

    it('Should return not found error with wrong id', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.delete('1')
      ).rejects.toThrow(new NotFoundError('Coffee not found!'));
    });
  });
});
