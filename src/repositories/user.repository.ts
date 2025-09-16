import { UserDto } from '../dto';
import { Pool } from 'pg';

class UserRepository {
  private readonly database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  public async create(user: UserDto) {
    const {
      email, password, fullname, address, phone, role = 'customer',
    } = user;
    const createdAt = new Date();
    const updatedAt = createdAt;

    const query = {
      text: 'insert into users(email, password, fullname, address, phone, role, created_at, updated_at) '
      + 'values($1, $2, $3, $4, $5, $6, $7, $8) returning id, email, fullname, address, phone',
      values: [email, password, fullname, address, phone, role, createdAt, updatedAt],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findById(id: number) {
    const query = {
      text: 'select id, email, password, fullname, address, phone from users where id = $1',
      values: [id],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findOne(email: string) {
    const query = {
      text: 'select id, email, password, fullname, address, phone from users where email = $1',
      values: [email],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findAll() {
    const query = {
      text: 'select email, fullname, address, phone from users',
    };
    const { rows } = await this.database.query(query);
    return rows;
  }

  public async update(id: number, user: Partial<UserDto>) {
    const entries = Object.entries(user).filter(([_, v]) => v !== undefined);
    const fields = entries.map(([key], i) => `${key}=$${i + 1}`).join(', ');
    const values = entries.map(([_, value]) => value);
    const query = {
      text: `update users set ${fields}, updated_at = $${entries.length + 1} where id = $${entries.length + 2} `+
      'returning email, fullname, address, phone',
      values: [...values, new Date(), id],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async delete(id: number) {
    const query = {
      text: 'delete from users where id = $1',
      values: [id],
    };
    const { rowCount } = await this.database.query(query);
    return (rowCount ?? 0) > 0;
  }

  public async verifyAdmin(id: number) {
    const query = {
      text: 'select role from users where id = $1',
      values: [id],
    };
    const { rows } = await this.database.query(query);
    const user = rows[0];

    if(user.role !== 'admin') {
      return false;
    }
    return true;
  }
}

export default UserRepository;
