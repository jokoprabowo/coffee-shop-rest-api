import { Pool } from 'pg';

class RefreshTokenRepository {
  private readonly database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  public async deleteToken(): Promise<boolean> {
    const query = {
      text: 'delete from refresh_tokens where is_revoked = true and created_at < now() - interval \'7 days\'',
      values: []
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default RefreshTokenRepository;
