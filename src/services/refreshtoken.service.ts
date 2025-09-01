import { RefreshTokenRepository } from '../repositories';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { NotFoundError } from '../exceptions';

class RefreshTokenService {
  private readonly repository: RefreshTokenRepository;

  constructor(repository: RefreshTokenRepository) {
    this.repository = repository;
  }

  public async generateToken(userId: number, deviceInfo?: string, ipAddress?: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);

    await this.repository.create({
      user_id: userId,
      token: hashedToken,
      device_info: deviceInfo,
      ip_address: ipAddress,
      expires_at,
    });
    
    return token;
  }

  public async verifyToken(userId: number, token: string) {
    const tokens = await this.repository.findActiveToken(userId);

    for (const item of tokens) {
      const isMatch = await bcrypt.compare(token, item.token);
      if (isMatch) {
        return item;
      }
    }
    return false;
  }

  public async revokeToken(userId: number, token: string) {
    const tokens = await this.repository.findTokenByUserId(userId);
    for (const item of tokens) {
      const isMatch = await bcrypt.compare(token, item.token);
      if (isMatch) {
        await this.repository.revokeToken(item.token);
        return true;
      }
    }
    throw new NotFoundError('Token not found!');
  }

  public async revokeAllTokens(userId: number) {
    const tokens = await this.repository.revokeAllTokens(userId);
    return tokens;
  }
}

export default RefreshTokenService;
