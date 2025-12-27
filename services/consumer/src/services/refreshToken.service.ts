import { RefreshTokenRepository } from '../repositories';

class RefreshTokenService {
  constructor(private readonly repository: RefreshTokenRepository) {}

  public async deleteToken(): Promise<boolean> {
    const token = await  this.repository.deleteToken();
    return token;
  }
}

export default RefreshTokenService;
