import { Pool } from 'pg';
import { coffeeDto } from '../dto';
import { v4 } from 'uuid';

class CoffeeRepository {
  private database: Pool;

  constructor() {
    this.database = new Pool();
  }

  public async create(data: coffeeDto) {
    const {
      name, price, description, image,
    } = data;
    const id = `coffee-${v4()}`;
    const createdAt = new Date();
    const updatedAt = createdAt;

    const query = {
      text: 'insert into coffees(id, name, price, description, image, created_at, updated_at) '
      + 'values ($1, $2, $3, $4, $5, $6, $8) returning name, price, description, image,',
      values: [id, name, price, description, image, createdAt, updatedAt],
    };

    const result = await this.database.query(query);
    return result;
  }

  public async findOne(id: string) {
    const query = {
      text: 'select name, price, description, image from coffees where id = $1',
      values: [id],
    };
    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async findAll() {
    const query = {
      text: 'select name, price, description, image from coffees',
    };
    const result = await this.database.query(query);
    return result;
  }

  public async update(id: string, data: Partial<coffeeDto>) {
    const {
      name, price, description, image
    } = data;
    const updatedAt = new Date();
    const query = {
      text: 'update coffees set name = $1, price = $2, description = $3, image = $4, '
      + 'update_at = $6 where id = $7 returning name, price, description, image,',
      values: [name, price, description, image, updatedAt],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async delete(id: string) {
    const query = {
      text: 'delete from coffees where id = $1',
      values: [id],
    };

    const result = await this.database.query(query);
    return result;
  }
}

export default CoffeeRepository;
