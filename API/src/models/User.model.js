const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
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
    passwordChangeAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExprise:{
        type: Date
    },
    address:[{type:mongoose.Types.ObjectId, ref:"Address"}],
    wishlist: [{type:mongoose.Types.ObjectId, ref:"Product"}],
    resetToken:{type: String}
},{
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods = {
    checkPassword: async function(password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordResetToken: function() {
        const resetTokenPassword = crypto.randomBytes(32).toString("hex")
        this.passwordResetToken = crypto.createHash('sha256').update(resetTokenPassword).digest('hex')
        this.passwordResetExprise = Date.now()+30*60*1000; // 10s
        return resetTokenPassword
    }
}
module.exports = mongoose.model("User",UserSchema)