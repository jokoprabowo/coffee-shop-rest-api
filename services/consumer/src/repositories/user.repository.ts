import { Pool } from 'pg';

class UserRepository {
  constructor(private readonly database: Pool) {}

  public async isUserExist(id: number): Promise<boolean> {
    const query = {
      text: 'select email from users where id = $1',
      values: [id],
    };
    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }
}

export default UserRepository;
