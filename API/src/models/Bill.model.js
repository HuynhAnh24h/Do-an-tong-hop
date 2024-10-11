const mongoose = require('mongoose')
const BillSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
},{
    versionKey: false,
    timestamps: true
})
module.exports = mongoose.model('Bill', BillSchema)