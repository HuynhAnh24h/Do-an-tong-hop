const jwt = require('jsonwebtoken')

module.exports = {
    // tạo khoá cho secretkey cho jwt
    generateAccessToken: (uid,role) =>{
        return jwt.sign({_id:uid,role},process.env.JWT_SECRET,{expiresIn:'2d'})
    },
    generateRefreshToken: (uid) =>{
        return jwt.sign({_id: uid},process.env.JWT_SECRET,{expiresIn:'7d'})
    }
} 