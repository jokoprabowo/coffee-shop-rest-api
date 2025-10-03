import { UserRepository } from '../repositories';
import { UserDto } from '../dto';
import { AuthorizationError, ConflictError, NotFoundError } from '../exceptions';
import { encryptInput } from '../utilities/encrypt';
import config from '../config';

class UserService {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public async create(data: UserDto) {
    if (data.role === 'admin' && !config.WHITELIST_ADMIN_EMAILS?.includes(data.email)){
      throw new AuthorizationError('You are not allowed to register as an admin!');
    }
    
    const check = await this.repository.findOne(data.email);
    if (check) {
      throw new ConflictError('Email already in used!');
    }

    data.password = await encryptInput(data.password);
    const user = await this.repository.create(data);
    return user;
  }

  public async findAll() {
    const users = await this.repository.findAll();
    return users;
  }

  public async findById(id: number) {
    const user = await this.repository.findById(id);
    if(!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }

  public async findOne(email: string) {
    const user = await this.repository.findOne(email);
    if(!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }

  public async update(id: number, data: Partial<UserDto>) {
    await this.findById(id);
    if(data.password) {
      data.password = await encryptInput(data.password);
    }
    const user = await this.repository.update(id, data);
    return user;
  }

  public async delete(id: number) {
    const user = await this.repository.delete(id);
    if (!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }

  public async verifyAdmin(id: number) {
    const user = await this.repository.verifyAdmin(id);
    if (!user) {
      throw new AuthorizationError('You do not have permission to access this resource!');
    }
  }
}

export default UserService;
