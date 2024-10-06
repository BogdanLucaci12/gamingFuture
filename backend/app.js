const cookieParser = require("cookie-parser");
const express = require('express')
const helmet = require('helmet')
const cors=require('cors')
require('dotenv').config()
const app = express()

const adminRouter = require('./src/routes/admin/admin.router')
const employeeRouter = require('./src/routes/employee/employee.router')
const publicRouter = require('./src/routes/public/public.router')


app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true
}))

app.use(express.json())
app.use(helmet())
app.use(cookieParser())

app.use('/admin', adminRouter)
app.use('/employee', employeeRouter)
app.use('/public', publicRouter)


module.exports = { app }