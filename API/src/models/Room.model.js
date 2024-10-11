const mongoose = require('mongoose')
const RoomSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        lowercase: true
    },
    desc: {
        type: String,
        required: true,
    },
    brand:{
        type: mongoose.Types.ObjectId,
        ref: 'Brand'
    },
    price:{
        type: Number,
        required: true
    },
    // CATEGORY
    house: {
        type: mongoose.Types.ObjectId,
        ref: "House"
    },
    status: {
        type: String,
        enum: ['active','warning','noactive'],
        default: 'noactive',
        required: true
    },
    imageRoom: {
        type: Array,
    },

},{
    timestamps: true,
    vesionKey: false
})

module.exports = mongoose.model('Rooms',RoomSchema)