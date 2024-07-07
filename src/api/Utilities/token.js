const jwt = require('jsonwebtoken');

module.exports = {
    createToken(payload){
        try{
            jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn : '1h',
            });
        }catch(err){
            throw new Error(err.message);
        }
    },

    verifyToken(token){
        try{
            jwt.verify(token, process.env.JWT_SECRET);
        }catch(err){
            throw new Error(err.message);
        }
    }
}