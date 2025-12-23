import { Pool } from 'pg';
import { UserTokenDTO } from '../dto';

class UserTokenRepository {
  private readonly database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  public async create(data: UserTokenDTO): Promise<UserTokenDTO> {
    const { user_id, token, type, expired_at } = data;
    const query = {
      text: 'insert into user_tokens(user_id, token, type, expired_at) '+
      'values($1, $2, $3, $4) returning user_id, token, expired_at',
      values: [user_id, token, type, expired_at],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findByToken(token: string): Promise<UserTokenDTO | null> {
    const query = {
      text: 'select user_id, token, expired_at from user_tokens where token = $1 '+
      'and created_at > now() - interval \'15 minutes\'',
      values: [token],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async deleteByUserId(userId: number): Promise<boolean> {
    const query = {
      text: 'delete from user_tokens where user_id = $1',
      values: [userId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default UserTokenRepository;
