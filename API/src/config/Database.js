const {default: mongoose} = require('mongoose')
const ConnectDatabase = async () => {
    try{
        const DbConnect = await mongoose.connect(process.env.MONGO_URL)
        if(DbConnect.connection.readyState === 1){
            console.log(":: Connect DB Successfully")
        }else{
            console.log(":: Connect Fail")
        }
    }catch(err){
        console.log(":: Connect with Error: ",err)
    }
}

module.exports = ConnectDatabase