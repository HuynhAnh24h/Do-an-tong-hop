module.exports = {
    notFound: (req,res,next)=>{
        const error = new Error(`Not Found: ${req.orignalUrl}`)
        res.status(404)
        next(error)
    },
    
    errHandler: (err,req,res,next) =>{
        const statuscode = res.statusCode == 200 ? 500 : res.statusCode
        res.status(statuscode)
        res.json({
            message: err?.message,
            stack: err?.stack,
        })
    }
}