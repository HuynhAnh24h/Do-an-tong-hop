const express = require('express')
const route = express.Router()
const ProductController = require('../controllers/Product.controller')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

route.post('/create-product',
    AuthMiddleware.authHandler,
    AuthMiddleware.checkAdmin,
    ProductController.createProduct)

route.get('/get-all-products',ProductController.getAllProduct)
route.get('/get-single-product/:id',ProductController.getSingleProduct)
route.put('/update-product/:id',
    AuthMiddleware.authHandler,
    AuthMiddleware.checkAdmin,
    ProductController.updateProduct)

route.delete('/delete-product/:id',
    AuthMiddleware.authHandler,
    AuthMiddleware.checkAdmin,
    ProductController.deleteProduct)
    
module.exports = route