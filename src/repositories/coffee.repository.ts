import { Pool } from 'pg';
import { coffeeDto } from '../dto';

class CoffeeRepository {
  private database: Pool;

  constructor(database: Pool) {
    this.database = database;
  }

  public async create(data: coffeeDto) {
    const {
      name, price, description, image,
    } = data;
    const createdAt = new Date();
    const updatedAt = createdAt;

    const query = {
      text: 'insert into coffees(name, price, description, image, created_at, updated_at) '
      + 'values ($1, $2, $3, $4, $5, $6) returning name, price, description, image',
      values: [name, price, description, image, createdAt, updatedAt],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
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
    const { rows } = await this.database.query(query);
    return rows;
  }

  public async update(id: string, data: Partial<coffeeDto>) {
    const {
      name, price, description, image
    } = data;
    const updatedAt = new Date();
    const query = {
      text: 'update coffees set name = $1, price = $2, description = $3, image = $4, '
      + 'updated_at = $5 where id = $6 returning name, price, description, image',
      values: [name, price, description, image, updatedAt, id],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }

  public async delete(id: string) {
    const query = {
      text: 'delete from coffees where id = $1',
      values: [id],
    };

    const { rows } = await this.database.query(query);
    return rows[0];
  }
}

export default CoffeeRepository;
