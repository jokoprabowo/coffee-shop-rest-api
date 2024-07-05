const postgre = require('../database/index');

const userRepository = {
    async create(createArgs){
        const { email, encrypt, name, address } = createArgs;
        const sql = 'insert into users(email, password, name, address, created_at, updated_at) ' +
                    'values($1, $2, $3, $4, $5, $6) returning *';
        const { rows } = await postgre.query(sql, [email, encrypt, name, address, new Date(), null]);
        return rows[0];
    },

    async findOne(email){
        const sql = 'select * from users where email = $1';
        const { rows } = await postgre.query(sql, [email]);
        return rows;
    },

    async update(updateArgs){
        const { email, encrypt, name, address } = updateArgs;
        const sql = 'update users set password = $1, name = $2, address = $3, updated_at = $4 ' +
                    'where email = $5 returning *';
        const { rows } = await postgre.query(sql, [encrypt, name, address, new Date(), email]);
        return rows[0];
    },
};

module.exports = userRepository;