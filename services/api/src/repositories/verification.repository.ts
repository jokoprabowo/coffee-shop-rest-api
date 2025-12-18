import { Pool } from 'pg';
import { VerificationDTO } from '../dto';

class VerificationRepository {
  private readonly database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  public async create(data: VerificationDTO): Promise<VerificationDTO> {
    const { user_id, token, expired_at } = data;
    const query = {
      text: 'insert into verification_tokens(user_id, token, expired_at) '+
      'values($1, $2, $3) returning user_id, token, expired_at',
      values: [user_id, token, expired_at],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findByToken(token: string): Promise<VerificationDTO | null> {
    const query = {
      text: 'select user_id, token, expired_at from verification_tokens where token = $1 '+
      'and created_at > now() - interval \'15 minutes\'',
      values: [token],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async deleteByUserId(userId: number): Promise<boolean> {
    const query = {
      text: 'delete from verification_tokens where user_id = $1',
      values: [userId],
    };

    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default VerificationRepository;
