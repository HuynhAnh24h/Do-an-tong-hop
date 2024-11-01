const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phone:{
        type: String,
        unique: true
    },
    role:{
        type: String,
        enum: ["admin","user"],
        default: "user" 
    },
    isBlocked:{
        type:Boolean,
        desc: String,
        default: false
    },
    cart:{
        type: Array,
        default: []
    },
    address:[{type:mongoose.Types.ObjectId, ref:"Address"}],
    wishlist: [{type:mongoose.Types.ObjectId, ref:"Product"}],
    resetToken:{type: String}
},{
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}
module.exports = mongoose.model("User",UserSchema)