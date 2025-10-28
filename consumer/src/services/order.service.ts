import { OrderRepository } from '../repositories';

class OrderService {
  private readonly repository: OrderRepository;

  constructor(repository: OrderRepository) {
    this.repository = repository;
  }

  public async deleteUnpaidOrder(): Promise<boolean> {
    const order = await this.repository.deleteUnpaidOrder();
    return order;
  }

  public async deletePaidOrder(): Promise<boolean> {
    const order = await this.repository.deletePaidOrder();
    return order;
  }
}

export default OrderService;
