import { Pool } from 'pg';

class UserRepository {
  private readonly database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

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
