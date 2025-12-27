import crypto from 'node:crypto';
import { UserDto, LoginUserDto, UserTokenDTO } from '../dto';
import { UserService, ProducerService } from './';
import { checkInput } from '../utilities/encrypt';
import { ClientError, NotFoundError } from '../exceptions';
import { UserTokenRepository } from '../repositories';

class AuthService {
  private readonly service: UserService;
  private readonly userTokenRepository: UserTokenRepository;
  private readonly rabbitMQ:  typeof ProducerService;

  constructor(service: UserService, userTokenRepository: UserTokenRepository, rabbitMQ: typeof ProducerService) {
    this.service = service;
    this.userTokenRepository = userTokenRepository;
    this.rabbitMQ = rabbitMQ;
  }

  public async register(data: Omit<UserDto, 'id'>): 
  Promise<Omit<UserDto, 'password'> & Partial<Pick<UserDto, 'password'>>>{
    const user = await this.service.create(data);
    return user;
  }

  public async login(data: LoginUserDto):
  Promise<Omit<UserDto, 'password'> & Partial<Pick<UserDto, 'password'>>> {
    const user = await this.service.findOne(data.email);
    const isMatch = await checkInput(data.password, user.password);
    if (!isMatch) {
      throw new ClientError('Password invalid!');
    }

    return user;
  }

  public async findByEmail(email: string): Promise<UserDto> {
    const user = await this.service.findOne(email);
    if (!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }

  public async updateUsedAt(token: string): Promise<boolean> {
    return this.userTokenRepository.updateUsedAt(token);
  }

  public async createUserToken(userId: number, type: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await this.userTokenRepository.create({
      user_id: userId,
      token: hashedToken,
      type,
      expires_at: expiresAt,
    });

    const date = new Date(expiresAt);
    const UTCString = date.toUTCString();

    const user = await this.service.findById(userId);
    const email = user.email;
    const fullname = user.fullname;
    const data = {
      email,
      fullname,
      token,
      expiresAt: UTCString,
    };
    await this.rabbitMQ.sendMessage(type, data);
    return token;
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    const data = await this.verifyToken(token);
    await this.service.update(data.user_id, { password: newPassword });
  }

  public async verifyToken(token: string): Promise<UserTokenDTO> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const data = await this.userTokenRepository.findByToken(hashedToken);
    if (!data) {
      throw new ClientError('Invalid or expired token');
    }

    if (data.type === 'email_verification') {
      await this.service.update(data.user_id, { is_verified: true });
    }
    await this.updateUsedAt(hashedToken);
    return data;
  }
}

export default AuthService;
