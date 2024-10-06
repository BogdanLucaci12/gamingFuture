const express = require('express')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const { logInAdmin, 
    deleteUserEmployee, 
    addEmployeeUser, 
    addAdminAccount, 
    deleteUserAdmin,
    getAdminUser,
    getEmployeeUser
} = require('../../controllers/adminController/admin.controller')
const { verifyTokenAdmin, verifyTokenInDb } =require('../../customFunction/verifyToken')
const adminRouter = express.Router()

adminRouter.post('/loginAdmin', logInAdmin)

adminRouter.use((req, res, next) => {
    const token=req.cookies.token
    if (!token) return res.status(401).send({ error: "Not authenticated" })
    const tokenInvalid = verifyTokenInDb(req, res)
    if (tokenInvalid.error) return res.status(502).send({ error: tokenInvalid.error })
    jwt.verify(token, process.env.JWT_TOKEN_KEY_ADMIN, (err, user)=>{
        if (err) {
            return res.status(403).cookie('token', '', {
                maxAge:0
            }).send({error:"Invalid cookie"})
        }
      next()
    })
    
})

adminRouter.post('/verifyToken', verifyTokenAdmin)

adminRouter.delete('/deleteUserEmployee', deleteUserEmployee)
adminRouter.delete('/deleteUserAdmin', deleteUserAdmin)

adminRouter.post('/addEmployeeUser', addEmployeeUser)
adminRouter.post('/addAdminAccount', addAdminAccount)

adminRouter.get('/getAdminUser', getAdminUser)
adminRouter.get('/getEmployeeUser', getEmployeeUser)


module.exports = adminRouter