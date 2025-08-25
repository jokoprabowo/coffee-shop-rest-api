import { UserRepository } from '../repositories';
import { userDto } from '../dto';
import { AuthorizationError, ConflictError, NotFoundError } from '../exceptions';
import { encryptPassword } from '../utilities/encrypt';
import config from '../config';

class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public async create(data: userDto) {
    if (data.role === 'admin' && !config.WHITELIST_ADMIN_EMAILS?.includes(data.email)){
      throw new AuthorizationError('You are not allowed to register as an admin!');
    }
    
    const check = await this.repository.findOne(data.email);
    if (check) {
      throw new ConflictError('Email already in used!');
    }

    data.password = await encryptPassword(data.password);
    const user = await this.repository.create(data);
    return user;
  }

  public async findAll() {
    const users = await this.repository.findAll();
    return users;
  }

  public async findOne(email: string) {
    const user = await this.repository.findOne(email);
    if(!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }

  public async update(email: string, data: Partial<userDto>) {
    await this.findOne(email);
    if(data.password) {
      data.password = await encryptPassword(data.password);
    }
    const user = await this.repository.update(email, data);
    return user;
  }

  public async delete(email: string) {
    const user = await this.repository.delete(email);
    if (!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }

  public async verifyAdmin(email: string) {
    const user = await this.repository.verifyAdmin(email);
    if (!user) {
      throw new AuthorizationError('You are not an admin!');
    }
  }
}

export default UserService;
