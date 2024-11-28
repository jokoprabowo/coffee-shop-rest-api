const postgre = require('../database/index');

const userRepository = {
  async create(createArgs) {
    const {
      email, encrypt, name, address, latitude, longitude,
    } = createArgs;
    const sql = 'insert into users(email, password, name, address, latitude, longitude, created_at, updated_at) '
    + 'values($1, $2, $3, $4, $5, $6, $7, $8) returning *';
    const { rows } = await postgre.query(sql, [email, encrypt, name, address, latitude, longitude, new Date(), null]);
    return rows[0];
  },

  async findOne(email) {
    const sql = 'select * from users where email = $1';
    const { rows } = await postgre.query(sql, [email]);
    return rows[0];
  },

  async update(updateArgs) {
    const {
      email, encrypt, name, address, latitude, longitude,
    } = updateArgs;
    const sql = 'update users set password = $1, name = $2, address = $3, latitude = $4, longitude = $5, updated_at = $6 '
    + 'where email = $7 returning *';
    const { rows } = await postgre.query(sql, [encrypt, name, address, latitude, longitude, new Date(), email]);
    return rows[0];
  },
};

module.exports = userRepository;
