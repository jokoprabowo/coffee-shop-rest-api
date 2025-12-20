import { UserRepository } from '../repositories';

class UserService {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public async isUserExist(id: number): Promise<boolean> {
    const user = await this.repository.isUserExist(id);
    return user;
  }
}

export default UserService;
