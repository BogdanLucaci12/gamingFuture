const express = require('express')

const { postLogin } = require('../controllers/loginAdmin.controller')

const logginAdminRouter = express.Router()

logginAdminRouter.use((req, res, next)=>{
    console.log("ip adress: ", req.ip)
    next()
})
logginAdminRouter.post('/', postLogin)
module.exports = logginAdminRouter