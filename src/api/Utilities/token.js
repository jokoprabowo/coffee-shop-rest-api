const jwt = require('jsonwebtoken');

module.exports = {
    createToken(payload){
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn : '1h',
        });
    }
}