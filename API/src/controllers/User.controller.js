const Jwt = require('../configs/JwtToken')
const UserModel = require('../models/User.model')
const asyncHandler = require('express-async-handler')
const ValidateMongo = require('../ultils/validateMongodb')
const jwt = require('jsonwebtoken')
const { sendMail } = require('./Email.controller')
const crypto = require('crypto')
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
            // const updateUser = await UserModel.findByIdAndUpdate(findUser.id,{
            //     resetToken: resetToken
            // },{new:true})
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
    }),

    // Reset password
    updatePassword: asyncHandler(async(req,res)=>{
        const { _id } = req.user
        const {password} = req.body
        ValidateMongo.validateMongoDb(_id)
        const user = await UserModel.findById({_id})
        if(password){
            user.password =password
            const updatePassword = await user.save()
            res.json(updatePassword)
        }else{
            res.json(user)
        }
    }),

    // Reset password token handle
    forgotPasswordToken: asyncHandler(async(req,res)=>{
        const {email} = req.body
        const user = await UserModel.findOne({email})
        if(!user) throw new Error(' User not found with this email')
        try{
            const token = user.createPasswordResetToken()
            await user.save()
            const resetUrl =`
             <!doctype html>
                <html lang="en-US">

                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Reset Password Email Template</title>
                    <meta name="description" content="Reset Password Email Template.">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>

                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>

                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                            Tình cute thông báo đến Seller 👻
                                                        </h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                           Để thay đỗi mật khẩu mới bạn vui lòng ấn vào link bên dưới, vui lòng không chia sẻ link này cho bất kỳ ai
                                                        </p>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0; text-align: center;">
                                                            Link Sẽ hết hạn trong 15p
                                                        </p>
                                                        <a href="http://localhost:5000/api/v1/user/reset-password-token/${token}"
                                                            style="background:#111828;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                            Đổi mật khẩu</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>

                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>

                </html>
                `
            const data ={
                to: email,
                subject:"Forgot Password Link",
                html:resetUrl
            }
            sendMail(data)
            res.json({
                token
            })
        }catch(err){
            throw new Error(err)
        }
    }),

    resetPasswordWithToken: asyncHandler(async(req,res)=>{
        res.json("Huỳnh Anh")
        // const {password} = req.body
        // const {token} = req.params
        // const hashedtoken = crypto.createHash('sha256').update(token).digest("hex")
        // const user = await UserModel.findOne({
        //    passwordResetToken:  hashedtoken,
        //     passwordResetExprise: { $gt: Date.Now() }
        // })
        // if(!user) throw new Error("Token hết hạn vui lòng thử lại sau")
        // user.password = password
        // user.passwordResetToken = undefined
        // user.passwordResetExprise = undefined
        // await user.save()
        // res.json(user)
    })
}