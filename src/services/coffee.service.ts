import { coffeeDto } from '../dto';
import { NotFoundError } from '../exceptions';
import { CoffeeRepository } from '../repositories';

class CoffeeService {
  private repository: CoffeeRepository;

  constructor(repository: CoffeeRepository) {
    this.repository = repository;
  }

  public async create(data: coffeeDto) {
    const coffee = await this.repository.create(data);
    return coffee;
  }

  public async findOne(id: string) {
    const coffee = await this.repository.findOne(id);
    if (!coffee) {
      throw new NotFoundError('Coffee not found!');
    }
    return coffee;
  }

  public async findAll() {
    const coffees = await this.repository.findAll();
    return coffees;
  }

  public async update(id: string, data: Partial<coffeeDto>) {
    await this.findOne(id);
    const coffee = await this.repository.update(id, data);
    return coffee;
  }

  public async delete(id: string) {
    await this.findOne(id);
    const coffee = await this.repository.delete(id);
    return coffee;
  }
}

export default CoffeeService;
