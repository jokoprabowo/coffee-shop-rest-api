import { RefreshTokenRepository } from '../repositories';

class RefreshTokenService {
  private readonly repository: RefreshTokenRepository;

  constructor(repository: RefreshTokenRepository) {
    this.repository = repository;
  }

  public async deleteToken(): Promise<boolean> {
    const token = await  this.repository.deleteToken();
    return token;
  }
}

export default RefreshTokenService;
