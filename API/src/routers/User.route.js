const express = require('express')
const router = express.Router()
const UserController = require('../controllers/User.controller')
const AuthMiddleware = require('../middlewares/AuthMiddleware')


// Sign In
router.post('/signin',UserController.createUser)

// Login
router.post('/login',UserController.loginUser)

// Get All
router.get('/get-all-user',
    AuthMiddleware.authHandler,
     AuthMiddleware.checkAdmin, 
     UserController.getAllUser)

// Get Single
router.get('/get-user/:id',
    AuthMiddleware.authHandler, 
    AuthMiddleware.checkAdmin, 
    UserController.getUser)

// Delete
router.delete('/delete-user/:id',
    AuthMiddleware.authHandler, 
    AuthMiddleware.checkAdmin, 
    UserController.deleteUser)

// Update
router.put('/update-user',
    AuthMiddleware.authHandler,  
    UserController.updateUser)

// Block
router.put('/block-user/:id',
    AuthMiddleware.authHandler, 
    AuthMiddleware.checkAdmin, 
    UserController.blockUser)
    
// UnBlock
router.put('/un-block-user/:id',
    AuthMiddleware.authHandler, 
    AuthMiddleware.checkAdmin, 
    UserController.unBlockUser)

module.exports = router