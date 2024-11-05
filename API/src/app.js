const express = require('express')
const app = express()
const Router = require('./routers')
const Database = require('./configs/Database')
const { notFound, errHandler } = require('./middlewares/ErrorHandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(morgan("dev"))

Router(app)
Database.DatabaseConnect()

app.use(notFound)
app.use(errHandler)

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`::: API run with http://localhost:${port}`)
})