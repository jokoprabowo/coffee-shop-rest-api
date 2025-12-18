import crypto from 'node:crypto';
import { UserDto, LoginUserDto } from '../dto';
import { UserService, ProducerService } from './';
import { checkInput } from '../utilities/encrypt';
import { ClientError } from '../exceptions';
import { VerificationRepository } from '../repositories';

class AuthService {
  private readonly service: UserService;
  private readonly verificationRepository: VerificationRepository;
  private readonly rabbitMQ:  typeof ProducerService;

  constructor(service: UserService, verificationRepository: VerificationRepository, rabbitMQ: typeof ProducerService) {
    this.service = service;
    this.verificationRepository = verificationRepository;
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

  public async createVerificationToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    await this.verificationRepository.create({
      user_id: userId,
      token: hashedToken,
      expired_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    const email = await this.service.findById(userId).then(u => u.email);
    const data = {
      email,
      token,
    };
    await this.rabbitMQ.sendMessage('email_verification', data);
    return token;
  }

  public async verifyToken(token: string): Promise<boolean> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const record = await this.verificationRepository.findByToken(hashedToken);
    if (!record) {
      throw new ClientError('Invalid or expired verification token');
    }
    await this.service.update(record.user_id, { is_verified: true });
    await this.verificationRepository.deleteByUserId(record.user_id);
    return true;
  }
}

export default AuthService;
