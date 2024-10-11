const UserModel = require('../models/User.model')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/Jwt.middleware')
const {sendMail} = require('../ultils/SendEmail')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
module.exports = {
    // Tạo tài khoản người dùng
    createUser: async (req,res) =>{
        try{
           const {email,password,phone} = req.body
           if(!email,!password,!phone){
                return res.status(400).json({
                    success: false,
                    message: "Missing input"
                })
           }
           if(await UserModel.findOne({email,phone})){
                return res.status(400).json({
                    success: false,
                    message: "User is used"
                })
           }
           const response = await UserModel.create(req.body)
           return res.status(200).json({
                success: true,
                message: "Create user success",
                response: response
            })
        }catch(err){
            return res.status(500).json({
                message: "Server Error 500",
                err: err.message
            })
        }
    },

    // Đăng nhập tài khoản người dùng
    loginUser: async (req,res) =>{
        try{
            const {email,password} = req.body
            if(!email || !password){
                return res.status(400).json({
                    success: false,
                    message: "Missing input"
                })
            }
            const user = await UserModel.findOne({email})
            if(user && await user.isCorrectPassword(password)){
                // Tách password role ra khỏi user để trả về data
                const {password, role, ...userData} = user.toObject()

                // Tạo accesstoken
                const accessToken = generateAccessToken(user._id,role)

                // Tạo refresh Token
                const refreshToken = generateRefreshToken(user._id)

                // Lưu refreshToken vào database
                await UserModel.findByIdAndUpdate(user._id,{refreshToken: refreshToken},{new: true})

                // Lưu refreshToken vào cookie
                res.cookie("refreshToken",refreshToken,{
                    httpOnly: true, // Cookie không thể truy cập từ javascript ( bảo mật cookie )
                    secure: true, // true nếu sử dụng https
                    maxAge: 3600000 // thời gian sống của cookie là 1 giờ
                })

                return res.status(200).json({
                        success: true,
                        message: "Login Success",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userData: userData
                })
            }else{
                return res.status(400).json({
                    message: "Mật khẩu không chính xác"
                })
            }
        }catch(err){
            return res.status(500).json({
                message: "Server Error 500",
                err: err.message
            })
        }
    },

    // Lấy tài khoản người dùng
    getCurrentUser: async (req,res)=>{
       try{
            const {_id} = req.user
            const user = await UserModel.findById(_id).select('-refreshToken -password -role')
            return res.status(200).json({
                success: true,
                userData: user ? user : "User Not pound"
            })
       }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
       }
    },
    
    // Cấp mới 1 AccessToken khi accessToken hết hạn nhưng RefreshToken Còn hạn sử dụng
    refreshAccessTokenUser: async (req,res)=>{
        try{
            // Lấy cookie từ cookies trong trình duyệt mục đích chỉ lấy Refresh Token
            const cookie = req.cookies

            // Check xem token có hợp lệ hay không
            if(!cookie && !cookie.refreshToken){
                return res.status(500).json({
                    success: false,
                    message: "No Refresh Token In Cookie"
                })
            }
            // Kiểm tra token có hợp lệ hay không ( check hạn sử dụng )
            const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
            const response = await UserModel.findOne({_id: result._id,refreshAccessToken: cookie.refreshAccessToken})
            return res.status(200).json({
                success: response ? true : false,
                newAccessToken: response ? generateAccessToken(response._id, response.role) : "Refresh Token Not Match"
            })   
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    logOutUser: async (req,res) =>{
        try{
            const cookie = req.cookies
            if(!cookie || !cookie.refreshToken){
                return res.status(500).json({
                    success: false,
                    message: "You Don't Login"
                })
            }
            // Xoá Refresh token ở DB
            await UserModel.findOneAndUpdate({refreshToken: cookie.refreshToken},{refreshToken:''},{new:true})

            // Xoá Refresh Token ở cookie trình duyệt 
            res.clearCookie('refreshToken',{
                httpOnly: true, // Cookie không thể truy cập từ javascript ( bảo mật cookie )
                secure: true, // true nếu sử dụng https
            })
            return res.status(200).json({
                success: true,
                message: "Logout Success"
            })

        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    forgotPassword: async(req,res) =>{
        try{
            const {email} = req.query
            if(!email){
                return res.status(500).json({
                    success: false,
                    message: "Missing Email"
                })
            }else{
                const user = await UserModel.findOne({email})
                if(!user){
                    return res.status(400).json({
                        success: false,
                        message: "Email is Invalid"
                    })
                }
                const resetToken = user.createPasswordChangeToken()
                await user.save()
                
                const html = `
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
                                                        <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}"
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
                const data = {
                    email: email,
                    html: html
                }
                const result = await sendMail(data)
                return res.status(200).json({
                    success: true,
                    mess: "You here",
                    rs: result
                })
            }
            
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
        
    },

    resetPassword: async (req,res)=>{
       try{
            const { password, token } = req.body
            if(!password || !token){
                return res.status(500).json({
                    success: false,
                    message: "Invalid password or reset token"
                })
            }
            const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
            const user = await UserModel.findOne({passwordResetToken, 
                passwordResetExprise:{$gt: Date.now()}
            })

            if(!user){
                return res.status(500).json({
                    success: false,
                    message: "Invalid reset token"
                })
            }

            user.password = password
            user.passwordResetToken = undefined
            user.passwordChangAt = Date.now()
            user.passwordResetExprise = undefined
            await user.save()

            return res.status(200).json({
                success: user? true : false,
                message: user ? "Change password success": "Change password fail",
                response: user ? user : undefined
            })

       }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
       }
    },

    getAllUser: async (req,res) =>{
        try{
            const allUser = await UserModel.find().select("-password -role -accessToken -passwordResetToken -passwordResetExprise")
            return res.status(200).json({
            success: allUser ? true: false,
            response: allUser ? allUser: "Invalid user"
        })}catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    getUpdateUser: async (req,res) =>{
        try{
            const {_id} = req.user
            if(!_id || Object.keys(req.body).length === 0){
                return res.status(400).json({
                    success: false,
                    message: "Isvalid user update"
                })
            }
            const updateUser = await UserModel.findByIdAndUpdate(_id, req.body, {new: true}).select("-password -role -accessToken")
            return res.status(200).json({
                success: updateUser ? true : false,
                message: updateUser ? `User ${updateUser.email} has been updated` : "Update Fail",
                data: updateUser ? updateUser : 'No Data'
            })

        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    updateUserByAdmin: async (req,res) =>{
        try{
            const {uid} = req.params
            if(Object.keys(req.body).length == 0){
                return res.status(400).json({
                    success: false,
                    message: "Isvalid user update by admin"
                })
            }
            const userUpdateByAdmin = await UserModel.findByIdAndUpdate(uid,req.body,{new: true})
            return res.status(200).json({
                success: userUpdateByAdmin ? true : false,
                message: userUpdateByAdmin ? `User ${userUpdateByAdmin.email} has been update by admin` : "Something went wrong",
                data: userUpdateByAdmin ? userUpdateByAdmin : "Not user update by admin"
            })

        }catch(err){
            return res.status(500).json({
                success: false,
                message: ree.message
            })
        }
    },

    deleteUser: async (req,res) =>{
        try{
            const {_id} = req.query
            if(!_id){
                return res.status(401).json({
                    success: false,
                    message: "Isvalid id user"
                })
            }
            const user = await UserModel.findByIdAndDelete({_id})
            return res.status(200).json({
                success: user ? true : false,
                message: user ? `Delete ${user.email}  success` : "Delete user Faill !!"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}