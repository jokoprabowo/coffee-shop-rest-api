import { OrderRepository } from '../repositories';

class OrderService {
  constructor(private readonly repository: OrderRepository) {}

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
