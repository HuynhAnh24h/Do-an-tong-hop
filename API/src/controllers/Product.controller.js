const ProductModel = require('../models/Product.model')
const asyncHandler = require('express-async-handler')
const ValidateMongo = require('../ultils/validateMongodb')
const slugify = require('slugify')
module.exports ={
    // Create Product
    createProduct: asyncHandler(async(req,res)=>{
        try{
            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const newProduct = await ProductModel.create(req.body)
            res.json(newProduct)
        }catch(err){
            throw new Error(err)
        }
    }),

    // Get All Product
    getAllProduct: asyncHandler(async(req,res)=>{
        try{
            // Filter Product
            const queryObj = {...req.query}
            const excludeFields = ["page","sort","limit","fields"]
            excludeFields.forEach((el)=>delete queryObj[el])  
            let queryStr = JSON.stringify(queryObj)
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`)

            let query = ProductModel.find(JSON.parse(queryStr))

            // Sorting Product
            if(req.query.sort){
                const sortBy = req.query.sort.split(',').join(" ")
                query = query.sort(sortBy)
            }else{
                query = query.sort("-createdAt")
            }

            // Limiting Fields
            if(req.query.fields){
                const fields = req.query.fields.split(',').join(" ")
                query = query.select(fields)
            }else{
                query = query.select("-__v")
            }

            // pagination 
            const page = req.query.page
            const limit = req.query.limit
            const skip = (page -1)*limit
            query = query.skip(skip).limit(limit)
            if(req.query.page){
                const productCount = await ProductModel.countDocuments()
                if(skip >= productCount) throw new Error('This page does not exists')
            }
            console.log(page,limit,skip)

            const products = await query
            res.json(products)
        }catch(err){
            throw new Error(err)
        }
    }),

    // Get Single Product
    getSingleProduct: asyncHandler(async(req,res)=>{
        try{
            const {id} = req.params
            ValidateMongo.validateMongoDb(id)
            const product = await ProductModel.findById(id)
            res.json({
                product
            })
        }catch(err){
            throw new Error(err)
        }
    }),

    // Update Product
    updateProduct: asyncHandler(async(req,res)=>{
        try{
            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const {id} = req.params
            ValidateMongo.validateMongoDb(id)
            const updateProduct = await ProductModel.findByIdAndUpdate(id,req.body,{new:true})
            if(updateProduct){
                res.json({
                    title: "Update Success",
                    updateProduct
                })
            }else{
                throw new Error(err)
            }

        }catch(err){
            throw new Error(err)
        }
    }),

    // Delete Product
    deleteProduct: asyncHandler(async(req,res)=>{
        try{
            const {id} = req.params
            const deleteProduct = await ProductModel.findByIdAndDelete(id)
            res.json({
                title:"Delete Success",
                deleteProduct
            })
        }catch(err){
            throw new Error(err)
        }
    }),
}