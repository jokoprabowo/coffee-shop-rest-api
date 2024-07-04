const postgre = require('../database/index');

const userService = {
    async create(createArgs){
        const { email, encrypt, name, address } = createArgs;
        const sql = 'insert into users(email, password, name, address, created_at, updated_at)' +
                    'values($1, $2, $3, $4, $5, $6) returning *';
        const { rows } = await postgre.query(sql, [email, encrypt, name, address, new Date(), null]);
        return rows[0];
    },
};

module.exports = userService;