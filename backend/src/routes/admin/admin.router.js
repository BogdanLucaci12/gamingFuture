const express = require('express')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const { logInAdmin, deleteUser, addEmployeeUser, addAdminAccount } = require('../../controllers/adminController/admin.controller')

const adminRouter = express.Router()

adminRouter.post('/loginAdmin', logInAdmin)
adminRouter.use((req, res, next) => {
    const token=req.cookies.token
    if(!token){return res.status(401)}
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user)=>{
        if (err) { return res.sendStatus(403)}
        next()
    })
})
adminRouter.delete('/delete', deleteUser)
adminRouter.post('/addEmployeeUser', addEmployeeUser)
adminRouter.post('/addAdminAccount', addAdminAccount)
module.exports = adminRouter