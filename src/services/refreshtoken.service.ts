import { RefreshTokenRepository } from '../repositories';
import { encryptInput, checkInput } from '../utilities/encrypt';
import crypto from 'crypto';
import { NotFoundError } from '../exceptions';

class RefreshTokenService {
  private readonly repository: RefreshTokenRepository;

  constructor(repository: RefreshTokenRepository) {
    this.repository = repository;
  }

  public async generateToken(userId: number, deviceInfo?: string, ipAddress?: string) {
    const selector = crypto.randomBytes(32).toString('hex');
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await encryptInput(token);
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);

    await this.repository.create({
      user_id: userId,
      selector,
      token: hashedToken,
      device_info: deviceInfo,
      ip_address: ipAddress,
      expires_at,
    });
    
    return (selector+'.'+token);
  }

  public async findUserIdBySelector(selector: string) {
    const data = await this.repository.findUserIdBySelector(selector);
    if (!data) {
      throw new NotFoundError('Token not found!');
    }
    return data.user_id;
  }

  public async verifyToken(selector: string, token: string) {
    const data = await this.repository.findActiveToken(selector);
    const isMatch = await checkInput(token, data.token);
    if (!isMatch) {
      return false;
    }
    return data;
  }

  public async revokeToken(selector: string) {
    const isSuccess = await this.repository.revokeToken(selector);
    if (!isSuccess) {
      throw new NotFoundError('Token not found!');
    }
  }

  public async revokeAllTokens(userId: number) {
    const tokens = await this.repository.revokeAllTokens(userId);
    return tokens;
  }
}

export default RefreshTokenService;
