const Jwt = require('../configs/JwtToken')
const UserModel = require('../models/User.model')
const asyncHandler = require('express-async-handler')
const ValidateMongo = require('../ultils/validateMongodb')
const jwt = require('jsonwebtoken')
module.exports ={
    // Create
    createUser: asyncHandler(async (req,res)=>{
        const email = req.body.email
        const findUser = await UserModel.findOne({email: email})
        if(!findUser){
            // Create new User
            const newUser = await UserModel.create(req.body)
            res.json(newUser)
        }else{
           throw new Error('User Already Exits')
        }
    }),

    // Login
    loginUser: asyncHandler(async (req,res)=>{
        const {email,password} = req.body
        // Check User
        const findUser = await UserModel.findOne({email: email})
        if(findUser && await findUser.checkPassword(password)){
            const resetToken = await Jwt.resetToken(findUser?._id)
            const updateUser = await UserModel.findByIdAndUpdate(findUser.id,{
                resetToken: resetToken
            },{new:true})
            res.cookie('resetToken',resetToken,{
                httpOnly: true,
                maxAge: 24*60*60*1000,
            })
            res.json({
                message: "Login Success",
                _id: findUser?._id,
                firstName: findUser?.firstName,
                lastName: findUser?.lastName,
                email: findUser?.email,
                mobile: findUser?.phone,
                token: Jwt.generateToken(findUser?._id),
                updateUser
            })
        }else{
            throw new Error('Invalid Credential')
        }
    }),

    // Get All User
    getAllUser: asyncHandler(async (req,res) => {
      try{
        const getUsers = await UserModel.find()
        res.json(getUsers)
      }catch(err){
        throw new Error(err)
      }
    }),

    // Get One User
    getUser: asyncHandler(async(req,res)=>{
        const {id} = req.params
        ValidateMongo.validateMongoDb(id)
        try{
            const getUser = await UserModel.findById(id)
            res.json(getUser)
        }catch(err){
            throw new Error(err)
        }
    }),

    // Update User
    updateUser: asyncHandler(async (req,res) => {
        const {id} = req.user
        ValidateMongo.validateMongoDb(id)
        try{
            const updateUser = await UserModel.findByIdAndUpdate(id,{
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                phone: req?.body?.phone
            },{new: true})
            if(updateUser){
                res.json({
                    message: "User update success",
                    updateUser
                })
            }else{
                throw new Error(err)
            }
        }catch(err){
            throw new Error(err)
        }
    }),

    // Deleted User
    deleteUser: asyncHandler(async (req,res) => {
        const {id} = req.params
        ValidateMongo.validateMongoDb(id)
        try{
            const deleteUser = await UserModel.findByIdAndDelete(id)
            res.json({
                message: "Delete user success",
                deleteUser
            })
        }catch(err){
            throw new Error(err)
        }
    }),  

    // Block
    blockUser: asyncHandler(async(req,res)=>{
        const {id} = req.params
        ValidateMongo.validateMongoDb(id)
        try{
            const blockUser = await UserModel.findByIdAndUpdate(id,{
                isBlocked: true
            },{new:true})
            res.json({
                message: "User is blocked",
                user: blockUser
            })
        }catch(err){
            throw new Error(err)
        }
    }),

    // Un Block
    unBlockUser: asyncHandler(async(req,res)=>{
        const {id} = req.params
        ValidateMongo.validateMongoDb(id)
        try{
            const unBlockUser = await UserModel.findByIdAndUpdate(id,{
                isBlocked: false
            },{new:true})
            res.json( res.json({
                message: "Un block user success",
                user: unBlockUser
            }))
        }catch(err){
            throw new Error(err)
        }
    }),

    // Handle Reset Token 
    handleReset: asyncHandler(async(req,res)=>{
        const cookie = req.cookies
        if(!cookie?.resetToken) throw new Error("No reset token in cookie")
        const resetToken = cookie.resetToken
        const user = await UserModel.findOne({resetToken})
        if(!user) throw new Error('No Refresh token present in db or not match')
        jwt.verify(resetToken, process.env.JWT_SIGN,(err,decode)=>{
            if(err || user.id !== decode.id){
                throw new Error("Wrong Reset Token")
            }
            const accessToken = Jwt.generateToken(user?._id)
            res.json({accessToken})
        })
        res.json({user})
    }),

    // Logout User
    logOut: asyncHandler(async(req,res)=>{
        const cookie = req.cookies
        if(!cookie?.resetToken) throw new Error('No Reset Token in Cookie')
        const resetToken = cookie.resetToken
        const user = await UserModel.find({resetToken})
        if(!user){
            res.clearCookie('resetToken',{
                httpOnly: true,
                secure: true
            })
            return res.sendStatus(204)
        }
        await UserModel.findOneAndUpdate({resetToken},{
            resetToken:"",
        })
        res.clearCookie('resetToken',{
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204)
    })
}