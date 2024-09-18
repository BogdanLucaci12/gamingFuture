const express = require('express')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const { logInAdmin, 
    deleteUserEmployee, 
    addEmployeeUser, 
    addAdminAccount, 
    deleteUserAdmin,
    getAdminUser,
    getEmployeeUSer
} = require('../../controllers/adminController/admin.controller')
const verifyToken=require('../../customFunction/verifyToken')

const adminRouter = express.Router()

adminRouter.post('/loginAdmin', logInAdmin)

adminRouter.use((req, res, next) => {
    const token=req.cookies.token
    if (!token) return res.status(401).send({ error: "Not authenticated" })
    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user)=>{
        if (err) {
            // res.clearCookie()
            return res.status(403).cookie('token', '', {
                maxAge:0
            }).send({error:"Invalid cookie"})
        }
      next()
    })
    
})

adminRouter.post('/verifyToken', verifyToken)
adminRouter.delete('/deleteUserEmployee', deleteUserEmployee)
adminRouter.delete('/deleteUserAdmin', deleteUserAdmin)
adminRouter.post('/addEmployeeUser', addEmployeeUser)
adminRouter.post('/addAdminAccount', addAdminAccount)
adminRouter.get('/getAdminUser', getAdminUser)
adminRouter.get('/getEmployeeUSer', getEmployeeUSer)

module.exports = adminRouter