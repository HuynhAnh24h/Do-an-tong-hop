const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const UserSchema = mongoose.Schema({
    firstName:{
        type: String,
    },
    lastName:{
        type:String
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum:["admin","user"],
        default: "user"
    },
    refreshToken:{
        type: String,
        default: null
    },
    passwordChangAt:{
        type: String,
        default: null
    },
    passwordResetToken:{
        type: String,
        default: null
    },
    passwordResetExprise:{
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
},{
    versionKey: false,
    timestamps: true
})

UserSchema.pre('save',async function(next){
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods = {
    isCorrectPassword: async function(paswword) {
        return await bcrypt.compare(paswword,this.password)
    },

    createPasswordChangeToken: function(){
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExprise = Date.now() + 15 * 60 * 1000
        return resetToken
    }   
}


module.exports = mongoose.model("User", UserSchema)