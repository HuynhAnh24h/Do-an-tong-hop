const express = require('express')
const router = express.Router()

// IMPORT CONTROLLER
const { 
    createHouse, 
    getAllHouse, 
    updateHouse, 
    deleteHouse 
} = require('../controllers/House.controller')

// IMPORT MIDDLEWARE
const { 
    verifyAccessToken, 
    isAdmin 
} = require('../middlewares/VerifyToken.middleware')

// USING ROUTER
router.post('/create-house',[verifyAccessToken,isAdmin],createHouse)
router.get('/list-house',[verifyAccessToken,isAdmin],getAllHouse)
router.put('/update-house/:hid',[verifyAccessToken,isAdmin],updateHouse)
router.delete('/delete-house/:hid',[verifyAccessToken,isAdmin],deleteHouse)

module.exports = router