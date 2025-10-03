import { UserDto, LoginUserDto } from '../dto';
import UserService from './user.service';
import { checkInput } from '../utilities/encrypt';
import { ClientError } from '../exceptions';

class AuthService {
  private readonly service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  public async register(data: UserDto) {
    const user = await this.service.create(data);
    return user;
  }

  public async login(data: LoginUserDto) {
    const user = await this.service.findOne(data.email);
    const isMatch = await checkInput(data.password, user.password);
    if (!isMatch) {
      throw new ClientError('Password invalid!');
    }
    return user;
  }
}

export default AuthService;
