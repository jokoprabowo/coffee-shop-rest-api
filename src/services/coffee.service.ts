import { CoffeeDto } from '../dto';
import { ConflictError, NotFoundError } from '../exceptions';
import { CoffeeRepository } from '../repositories';
import { CacheService } from './';

interface CoffeeResponse {
  coffees: CoffeeDto[],
  source: string,
}

class CoffeeService {
  private readonly repository: CoffeeRepository;
  private readonly cache: CacheService;

  constructor(repository: CoffeeRepository, cache: CacheService) {
    this.repository = repository;
    this.cache = cache;
  }

  public async create(data: CoffeeDto): Promise<CoffeeDto> {
    const isExist = await this.repository.findByName(data.name);
    if (isExist) {
      throw new ConflictError('Coffee data already exist!');
    }
    const coffee = await this.repository.create(data);
    await this.cache.del('coffees');
    return coffee;
  }

  public async findOne(id: number): Promise<CoffeeDto> {
    const coffee = await this.repository.findOne(id);
    if (!coffee) {
      throw new NotFoundError('Coffee not found!');
    }
    return coffee;
  }

  public async findAll(): Promise<CoffeeResponse> {
    let coffees;
    const data = await this.cache.get('coffees');
    if (data) {
      coffees = JSON.parse(data);
      return {
        coffees,
        source: 'cache',
      };
    }
    coffees = await this.repository.findAll();
    await this.cache.set('coffees', JSON.stringify(coffees));
    return {
      coffees,
      source: 'database',
    };
  }

  public async update(id: number, data: Partial<CoffeeDto>): Promise<CoffeeDto> {
    await this.findOne(id);
    const coffee = await this.repository.update(id, data);
    await this.cache.del('coffees');
    return coffee;
  }

  public async delete(id: number): Promise<boolean> {
    await this.findOne(id);
    const coffee = await this.repository.delete(id);
    await this.cache.del('coffees');
    return coffee;
  }
}

export default CoffeeService;
