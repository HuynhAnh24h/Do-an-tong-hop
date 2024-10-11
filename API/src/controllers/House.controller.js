const HouseModel = require('../models/House.model')
module.exports = {
    // CREATE
    createHouse: async (req,res) =>{
        try{
            const house = await HouseModel.create(req.body)
            return res.status(200).json({
                success: house ? true : false,
                data: house ? house : "No data"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    //GET
    getAllHouse: async (req,res) => {
        try{
            const listHouse = await HouseModel.find()
            return res.status(200).json({
                success: listHouse ? true : false,
                message: listHouse ? "Get list success" : "Get list Fail !",
                response: listHouse ? listHouse : "No data"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    // UPDATE
    updateHouse: async (req,res) =>{
        try{
            const {hid} = req.params
            if(!hid || Object.keys(req.body).length==0){
                return res.status(400).json({
                    success: false,
                    message: "Invalid uid"
                })
            }
            const updateHouse = await HouseModel.findByIdAndUpdate(hid,{new: true})
            return res.status(200).json({
                success: updateHouse ? true : false,
                message: updateHouse ? `Update ${updateHouse.title} success` : "Update fail",
                response: updateHouse ? updateHouse : 'No data update'
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }, 

    // DELETE
    deleteHouse: async (req,res) =>{
        try{
            const {hid} = req.params
            if(!hid){
                return res.status(400).json({
                    success: false,
                    message: "Invalid id"
                })
            }
            const deleteHouse = await HouseModel.findByIdAndDelete(hid)
            return res.status(200).json({
                success: deleteHouse ? true : false,
                message: deleteHouse ? `Delete ${deleteHouse.title} success` : "Delete fail"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },
}