import { RefreshTokenRepository } from '../repositories';
import { encryptInput, checkInput } from '../utilities/encrypt';
import crypto from 'crypto';
import { NotFoundError, ClientError } from '../exceptions';
import { RefreshTokenDTO } from '../dto';

class RefreshTokenService {
  private readonly repository: RefreshTokenRepository;

  constructor(repository: RefreshTokenRepository) {
    this.repository = repository;
  }

  public async generateToken(userId: number, deviceInfo?: string, ipAddress?: string): Promise<string> {
    const selector = crypto.randomBytes(32).toString('hex');
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await encryptInput(token);
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);
    const expires_at = expireDate.toISOString();

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

  public async findUserIdBySelector(selector: string): Promise<number> {
    const data = await this.repository.findUserIdBySelector(selector);
    if (!data) {
      throw new NotFoundError('Token not found!');
    }
    return data.user_id;
  }

  public async verifyToken(selector: string, token: string):
  Promise<Pick<RefreshTokenDTO, 'token' | 'is_revoked'>> {
    const data = await this.repository.findActiveToken(selector);
    const isMatch = await checkInput(token, data.token);
    if (!isMatch) {
      throw new ClientError('Invalid refresh token!');
    }
    return data;
  }

  public async revokeToken(selector: string): Promise<boolean> {
    const token = await this.repository.revokeToken(selector);
    if (!token) {
      throw new NotFoundError('Token not found!');
    }
    return token;
  }

  public async revokeAllTokens(userId: number): Promise<boolean> {
    const tokens = await this.repository.revokeAllTokens(userId);
    return tokens;
  }
}

export default RefreshTokenService;
