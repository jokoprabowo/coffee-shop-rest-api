import { userDto } from '../dto';
import UserService from './user.service';
import { checkPassword } from '../utilities/encrypt';
import { ClientError } from '../exceptions';

class AuthService {
  private service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  public async register(data: userDto) {
    const user = await this.service.create(data);
    return user;
  }

  public async login(email: string, password: string) {
    const user = await this.service.findOne(email);
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      throw new ClientError('Password invalid!');
    }
    return user;
  }
}

export default AuthService;
