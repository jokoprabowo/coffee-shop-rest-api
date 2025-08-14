const postgre = require('../database/index');

const transactionRepository = {
  async create(args) {
    const {
      email, cookieId, totalItem, totalPrice,
    } = args;
    const sql = 'insert into transactions(email, cookie_id, total_item, total_price, created_at, updated_at) '
    + 'values($1, $2, $3, $4, $5, $6) returning *';
    const {
      rows,
    } = await postgre.query(sql, [email, cookieId, totalItem, totalPrice, new Date(), null]);
    return rows[0];
  },

  async findAll() {
    const sql = 'select * from transactions';
    const { rows } = await postgre.query(sql);
    return rows;
  },

  async findOne(id) {
    const sql = 'select * from transactions where id = $1';
    const { rows } = await postgre.query(sql, [id]);
    return rows[0];
  },

  async update(args, id) {
    const {
      email, cookieId, totalItem, totalPrice,
    } = args;
    const sql = 'update transactions set email = $1, cookie_id = $2, total_item = $3, total_price = $4, updated_at = $5 '
    + 'where id = $6 returning *';
    const {
      rows,
    } = await postgre.query(sql, [email, cookieId, totalItem, totalPrice, new Date(), id]);
    return rows[0];
  },
};

module.exports = transactionRepository;
