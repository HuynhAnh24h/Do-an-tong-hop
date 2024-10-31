const jwt = require('jsonwebtoken')

const refreshToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SIGN,{expiresIn: "3d"})
}