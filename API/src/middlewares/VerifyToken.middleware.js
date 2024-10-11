const jwt = require('jsonwebtoken')

module.exports ={
    verifyAccessToken: async (req,res, next) =>{
       try{
            if(req?.headers?.authorization?.startsWith('Bearer')){
                const token = req.headers.authorization.split(' ')[1]
                jwt.verify(token, process.env.JWT_SECRET, (err, decode)=>{
                    if(err){
                        return res.status(401).json({
                            success: false,
                            message: "Invalid Access Token"
                        })
                    }
                    console.log(decode)
                    req.user = decode
                    next()
                })
            }else{
                return res.status(401).json({
                    success: false,
                    message: "Require Authentication"
                })
            }

       }catch(err){
            return res.status(500).json({
                success: false,
                error: err.message
            })
       } 
    },

    isAdmin: async (req,res,next) =>{
        try{
            const {role} = req.user
            if(role !== 'admin'){
                return res.status(401).json({
                    success: false,
                    message: "Isvalid Admin Role"
                })  
            }else{
                next()
            }
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
        
    }
}