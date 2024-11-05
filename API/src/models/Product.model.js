const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    desc:{
        type:String,
        required:true,
        unique:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        require: true
    },
    images:{
        type: Array,
    },
    color:{
        type: String,
        required: true
    },
    ratings:[{
        start: Number,
        posteby:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    comment:[{
        title: String,
        desc: String,
        posterby:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    sold:{
        type: Number,
        default: 0,
        select: false
    }
},{timestamps: true});

//Export the model
module.exports = mongoose.model('Product', ProductSchema);