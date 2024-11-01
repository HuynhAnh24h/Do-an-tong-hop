const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: (id) =>{
        return jwt.sign({id},process.env.JWT_SIGN,{expiresIn: "1d"})
    },
    
    resetToken: (id) =>{
        return jwt.sign({id},process.env.JWT_SIGN,{expiresIn: "3d"})
    }
}