const express = require('express')
const app = express()
const Router = require('./routers')
const Database = require('./configs/Database')
const { notFound, errHandler } = require('./middlewares/ErrorHandler')
require('dotenv').config()
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
Router(app)
Database.DatabaseConnect()

app.use(notFound)
app.use(errHandler)

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`::: API run with http://localhost:${port}`)
})