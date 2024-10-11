const express = require('express')
const router = express.Router()

// IMPORT CONTROLLER
const { 
    createBrand, 
    getList, 
    updateBrand, 
    deleteBrand 
} = require('../controllers/Brand.controller')

// IMPORT MIDDLEWARE
const { 
    verifyAccessToken, 
    isAdmin 
} = require('../middlewares/VerifyToken.middleware')

// USING ROUTER
router.post('/create-brand',[verifyAccessToken,isAdmin], createBrand)
router.get('/list-brand',[verifyAccessToken, isAdmin], getList)
router.put('/update-brand/:bid',[verifyAccessToken,isAdmin],updateBrand)
router.delete('/delete-brand/:uid',[verifyAccessToken,isAdmin],deleteBrand)

module.exports = router