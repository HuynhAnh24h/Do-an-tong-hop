const mongoose = require('mongoose')
const BrandSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
},{
    timestamps: true,
    versionKey: false
})
module.exports = mongoose.model('Brand',BrandSchema)