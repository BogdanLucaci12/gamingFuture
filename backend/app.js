const cookieParser = require("cookie-parser");
const express = require('express')
const helmet = require('helmet')
const cors=require('cors')

const adminRouter = require('./src/routes/admin/admin.router')
const employeeRouter = require('./src/routes/employee/employee.router')
const publicRouter = require('./src/routes/public/public.router')
require('dotenv').config()
const app = express()
app.use(cors({
    origin:['http://localhost:3000', 'http://192.168.0.101'],
    credentials:true
}))
app.use(express.json())
app.use(helmet())
app.use(cookieParser())

app.use('/admin', adminRouter)
app.use('/employee', employeeRouter)
app.use('/public', publicRouter)


module.exports = app