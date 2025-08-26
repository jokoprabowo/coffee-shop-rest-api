import { userDto } from '../dto';
import { Pool } from 'pg';

class UserRepository {
  private database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  public async create(user: userDto) {
    const {
      email, password, fullname, address, phone, role
    } = user;
    const createdAt = new Date();
    const updatedAt = createdAt;

    const query = {
      text: 'insert into users(email, password, fullname, address, phone, role, created_at, updated_at) '
      + 'values($1, $2, $3, $4, $5, $6, $7, $8) returning email, fullname, address, phone',
      values: [email, password, fullname, address, phone, role, createdAt, updatedAt],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findOne(email: string) {
    const query = {
      text: 'select email, password, fullname, address, phone from users where email = $1',
      values: [email],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findAll() {
    const query = {
      text: 'select email, fullname, address, phone from users',
    };
    const result = await this.database.query(query);
    return result;
  }

  public async update(email: string, user: Partial<userDto>) {
    const {
      password, fullname, address, phone
    } = user;
    const query = {
      text: 'update users set password = $1, fullname = $2, address = $3, phone = $4, updated_at = $5 '
      + 'where email = $6 returning email, fullname, address, phone',
      values: [password, fullname, address, phone, new Date(), email],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async delete(email: string) {
    const query = {
      text: 'delete from users where email = $1',
      values: [email],
    };
    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async verifyAdmin(email: string) {
    const query = {
      text: 'select role from users where email = $1',
      values: [email],
    };
    const { rows } = await this.database.query(query);
    const user = rows[0];

    if(user !== 'admin') {
      return false;
    }
    return true;
  }
}

export default UserRepository;
