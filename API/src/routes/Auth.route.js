const express = require('express')
const router = express.Router()

// IMPORT CONTROLLER
const { 
    createUser, 
    loginUser, 
    getCurrentUser, 
    refreshAccessTokenUser, 
    logOutUser, 
    forgotPassword, 
    resetPassword,
    getAllUser,
    deleteUser,
    getUpdateUser
} = require('../controllers/User.controller')

const { verifyAccessToken, isAdmin } = require('../middlewares/VerifyToken.middleware')

router.post("/create-user", createUser)
router.post("/login-user",loginUser)
router.get('/get-current-user',verifyAccessToken,getCurrentUser)
router.post('/refresh-token',verifyAccessToken,refreshAccessTokenUser)
router.get('/logout-user',logOutUser)
router.get('/forgot-password-user',forgotPassword)
router.put('/reset-password', resetPassword)
router.get('/get-all-user',[verifyAccessToken,isAdmin],getAllUser)
router.delete('/delete-user',[verifyAccessToken,isAdmin],deleteUser)
router.put('/update-user',[verifyAccessToken],getUpdateUser)
router.put('/update-user-by-admin/:uid',[verifyAccessToken,isAdmin],getUpdateUser)

module.exports = router