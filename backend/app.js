const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");
const express = require('express')
const helmet = require('helmet')

const adminRouter = require('./src/routes/admin/admin.router')
const employeeRouter = require('./src/routes/employee.router')
const publicRouter = require('./src/routes/public.router')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(helmet())
app.use(cookieParser())

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SESSION_KEY]
}))

app.use('/admin', adminRouter)
app.use('/employee', employeeRouter)
app.use('/public', publicRouter)


module.exports = app