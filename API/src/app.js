const express = require('express')
const ConnectDatabase = require('./config/Database')
const router = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
const port = process.env.PORT

// Using middleware
app.use(cors({
    origin: process.env.CLIENT_URL, // Cấp quyền cho URL client
    methods: ['GET','POST','PUT','DETELE'], // Các phương thức mà client được phép
    allowedHeaders:['Content-Type', 'Authorization'], // Các header được phép truy cập
    credentials: true, // Cho phép cookies (nếu cần)
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Using Database
ConnectDatabase()

// Using Route API
router(app)


app.listen(port, ()=>{
    console.log(`:: API Work with http://localhost:${port}`)
})