import { UserRepository } from '../repositories';

class UserService {
  constructor(private readonly repository: UserRepository) {}

  public async isUserExist(id: number): Promise<boolean> {
    const user = await this.repository.isUserExist(id);
    return user;
  }
}

export default UserService;
