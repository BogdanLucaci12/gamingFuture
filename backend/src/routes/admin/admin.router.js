const express = require('express')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const { logInAdmin, deleteUserEmployee, addEmployeeUser, addAdminAccount, deleteUserAdmin } = require('../../controllers/adminController/admin.controller')
const { employeePool } = require('../../configAndConnection/postgres.conexion')

const adminRouter = express.Router()

adminRouter.post('/loginAdmin', logInAdmin)

adminRouter.use((req, res, next) => {
    const token=req.cookies.token
    if(!token){return res.sendStatus(401)}
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user)=>{
        if (err) { return res.sendStatus(403)}
        next()
    })
})
adminRouter.delete('/deleteUserEmployee', deleteUserEmployee)
adminRouter.delete('/deleteUserAdmin', deleteUserAdmin)
adminRouter.post('/addEmployeeUser', addEmployeeUser)
adminRouter.post('/addAdminAccount', addAdminAccount)
module.exports = adminRouter