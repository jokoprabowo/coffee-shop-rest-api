import { Pool } from 'pg';
import { RefreshToken } from '../dto';

class RefreshTokenRepository {
  private readonly database: Pool;
  
  constructor(database: Pool) {
    this.database = database;
  }

  public async create(data: RefreshToken) {
    const {
      user_id, token, device_info, ip_address, expires_at
    } = data;

    const query = {
      text: 'insert into refresh_tokens(user_id, token, device_info, ip_address, expires_at)'
      + 'values($1, $2, $3, $4, $5) returning token',
      values: [user_id, token, device_info, ip_address, expires_at],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findUserIdByToken(token: string) {
    const query = {
      text: 'select user_id from refresh_tokens where token = $1',
      values: [token],
    };
    
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findTokenByUserId(userId: number) {
    const query = {
      text: 'select token from refresh_tokens where user_id = $1',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async findActiveToken(userId: number) {
    const query = {
      text: 'select token, is_revoked from refresh_tokens where user_id = $1 and expires_at > now()',
      values: [userId],
    };

    const { rows } = await this.database.query(query);
    return rows;
  }

  public async revokeToken(token: string) {
    const query = {
      text: 'update refresh_tokens set is_revoked = true where token = $1',
      values: [token],
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
