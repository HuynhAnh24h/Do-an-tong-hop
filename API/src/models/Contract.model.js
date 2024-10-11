const mongoose = require('mongoose')
const ConstractSchema = mongoose.Schema({

},{
    versionKey: false,
    timestamps: true
})
module.exports = mongoose.model('Constract', ConstractSchema)