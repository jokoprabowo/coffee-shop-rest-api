import { Pool } from 'pg';
import { RefreshToken } from '../dto';

class RefreshTokenRepository {
  private readonly database: Pool;
  
  constructor(database: Pool) {
    this.database = database;
  }

  public async create(data: RefreshToken) {
    const {
      user_id, selector, token, device_info, ip_address, expires_at
    } = data;

    const query = {
      text: 'insert into refresh_tokens(user_id, selector, token, device_info, ip_address, expires_at) '
      + 'values($1, $2, $3, $4, $5, $6) returning token',
      values: [user_id, selector, token, device_info, ip_address, expires_at],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findUserIdBySelector(selector: string) {
    const query = {
      text: 'select user_id from refresh_tokens where selector = $1',
      values: [selector],
    };
    
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findActiveToken(selector: string) {
    const query = {
      text: 'select token, is_revoked from refresh_tokens where selector = $1 and expires_at > now()',
      values: [selector],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async revokeToken(selector: string) {
    const query = {
      text: 'update refresh_tokens set is_revoked = true where selector = $1',
      values: [selector],
    };

    const { rowCount } = await this.database.query(query);
    if (rowCount === null) {
      return false;
    }
    return true;
  }

  public async revokeAllTokens(userId: number) {
    const query = {
      text: 'update refresh_tokens set is_revoked = true where user_id = $1',
      values: [userId],
    };

    const { rowCount } = await this.database.query(query);
    if (rowCount === null) {
      return false;
    }
    return true;
  }
}

export default RefreshTokenRepository;
