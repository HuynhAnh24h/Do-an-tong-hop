const RoomModel = require('../models/Room.model')
const slugify = require('slugify')
module.exports = {
    // CREATE
    createRoom: async (req,res) =>{
        try{
            if(Object.keys(req.body).length === 0){
                return res.status(500).json({
                    success: false,
                    message: "Room Is Valid"
                })
            }
            if(req.body && req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const newRoom = await RoomModel.create(req.body)
            return res.status(200).json({
                success: newRoom ? true : false,
                message: newRoom ? `Create ${newRoom.title} success` : "Create Fail !!",
                data: newRoom ? newRoom : "Data not pound"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },
     
    // UPDATE
    updateRoom: async (req,res) => {
        try{
            const {rid} = req.params
            if(!rid || Object.keys(req.body).length === 0){
                return res.status(200).json({
                    success: false,
                    message: "Invalid ID room or Request in body"
                })
            }
            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const dataRooms = await RoomModel.findByIdAndUpdate(rid,req.body,{new:true})
            return res.status(200).json({
                success: dataRooms ? true : false,
                message: dataRooms ? `${dataRooms.title} edit success` : "Edit fail",
                data: dataRooms ? dataRooms : "No data"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },
    getRoom: async (req,res) =>{
        const {rid} = req.params
        const room = await RoomModel.findById(rid)
        if(!room){
            return res.status(500).json({
                success: false,
                message: "Invalid id Room"
            })
        }
        return res.status(200).json({
            success: room ? true : false,
            roomData: room ? room : 'No data'
        })

    },

    // GET ALL
    getAllRoom: async (req,res) =>{
        try{
            const queries = {...req.query}

            // TÁCH CÁC TRƯỜNG ĐẶC BIỆT RA KHỎI QUERY
            const excludeFields = ['limits','sort','page','fields']
            excludeFields.forEach(element => delete queries[element])

            // FORMAT LẠI TOÁN TỬ CHO ĐÚNG VỚI MONGODB
            let queryString = JSON.stringify(queries)
            queryString = queryString.replace(/\b(gte|gt|li|lte)\b/g, matchElement =>`$${matchElement}`)
            const formatedQuery =JSON.parse(queryString)

            // FITERING
            if(queries?.title){
                formatedQuery.title = {$regex: queries.title, $options: "i"}
            }
            let queryCommand = RoomModel.find(formatedQuery)

            // SORTING
            if(req.query.sort){
                const sortBy = req.query.sort.split(',').join(' ')
                queryCommand = queryCommand.sort(sortBy)
            }

            // LIMITS 
            if(req.query.fields){
                const fields = req.query.fields.split(',').join(' ')
                queryCommand = queryCommand.select(fields)
            }

            // PAGINATION
            // Chuyển từ dạng chuỗi sang dạng số
            const page = +req.query.page || 1
            const limit = +req.query.limit || process.env.LIMIT_PRODUCT
            const skip = (page-1)*limit
            queryCommand.skip(skip).limit(limit)
            
            // EXECUTE QUERY
            // SỐ LƯỢNG SP THOẢ MÃN ĐIỀU KIỆN != SỐ LƯỢNG SẢN PHẨM TRẢ VỀ SAU MỖI LẦN GỌI API  
            queryCommand.exec()
            .then(async response => {
                const counts = await RoomModel.find(formatedQuery).countDocuments()
                return res.status(200).json({
                    success: response ? true : false,
                    count: counts,
                    data: response ? response : "No data",
                })
            })
            .catch(err =>{
                return res.status(500).json({
                    success: false,
                    message: err.message
                })
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
                
    },

    // DELETE
    deleteRoom: async (req,res) =>{
        try{
            const {rid} = req.params
            if(!rid){
                return res.status(500).json({
                    success: false,
                    message: "Ivalid _id room delete"
                })
            }
            const deleteRoom = await RoomModel.findByIdAndDelete(rid)
            return res.status(200).json({
                success: deleteRoom ? true : false,
                message: deleteRoom ? `Rom ${deleteRoom.title} has been delete` : "Delete Fail",
                dataDelete: deleteRoom ? deleteRoom : "no data delete"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}