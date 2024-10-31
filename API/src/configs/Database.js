const {default: mongoose} = require('mongoose')

module.exports = {
    DatabaseConnect: async () =>{
        try{
            const dbConnect = await mongoose.connect(process.env.MONGO_URL)
            if(dbConnect.connection.readyState === 1){
                console.log("::: Connect Success")
            }else{
                console.log("::: Connect Fail !!!")
            }

        }catch(err){
            console.log("::: Connect Database Wrong")
        }
    }
}