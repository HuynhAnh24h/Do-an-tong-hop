const BrandModel = require('../models/Brand.model')
module.exports = {
    // CREATE
    createBrand: async (req,res) =>{
        try{
            const newBrand = await BrandModel.create(req.body)
            return res.status(200).json({
                susccess: newBrand ? true : false,
                message: newBrand ? `Create ${newBrand.title} success` : "Create Brand Fail",
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    // GET LIST
    getList: async (req,res) =>{
        try{
            const listBrand = await BrandModel.find()
            return res.status(200).json({
                success: listBrand ? true : false,
                message: listBrand ? "Get list success" : "Get list Fail",
                response: listBrand ? listBrand : "No data"
            })

        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    // UPDATE
    updateBrand: async (req,res) =>{
        try{
            const {bid} = req.params
            if(!bid || Object.keys(req.body).length === 0){
                return res.status(400).json({
                    success: false,
                    message: "Invalid Brand ID or Update Data"
                })
            }

            const updateBrand = await BrandModel.findByIdAndUpdate(bid,{new:true})
            return res.status(200).json({
                success: updateBrand ? true : false,
                message: updateBrand ? "Update success" : "Update Fail"
            })

        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    // DELETE 
    deleteBrand: async (req,res) =>{
        try{
            const {bid} = req.params
            const deleteBrand = await BrandModel.findByIdAndDelete(bid)
            return res.status(200).json({
                success: deleteBrand ? true : false,
                message: deleteBrand ? "Delete Success" : "Delete Fail !"
            })

        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}