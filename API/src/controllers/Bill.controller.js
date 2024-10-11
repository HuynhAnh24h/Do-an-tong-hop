const BillModel = require('../models/Bill.model')
module.exports = {
    // CREATE
    createBill: async (req,res)=>{
        try{
            const newBill = await BillModel.create(req.body)
            return res.status(200).json({
                success: newBill ? true : false,
                message: newBill ? "Create bill success" : "Create fail",
                data: newBill ? newBill : "No data"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    // GET ALL BILL
    getAllBill: async (req,res)=>{
        try{
            const listBill = await BillModel.find()
            return res.status(200).json({
                success: listBill ? true : false,
                message: listBill ? "Get list success" : "Get list fail",
                data: listBill ? listBill : "No data"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}