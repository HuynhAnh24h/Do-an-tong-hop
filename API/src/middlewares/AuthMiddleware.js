const UserModel = require('../models/User.model')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
module.exports = {
    authHandler: asyncHandler(async(req,res,next)=>{
        let token
        if(req.headers?.authorization?.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
            try{
               if(token){
                    const decoded = jwt.verify(token,process.env.JWT_SIGN)
                    const user = await UserModel.findById(decoded?.id)
                    req.user = user
                    next()
               }  
            }catch(err){
                throw new Error(err)    
            }
        }else{
            throw new Error("Headers not Token")
        }
    }),

    checkAdmin: asyncHandler(async(req,res,next)=>{
        const {email} = req.user
        const adminUser = await UserModel.findOne({email})
        if(adminUser.role !== "admin"){
            throw new Error('You not admin Cút ')
        }else{
            next()
        }
    })
}