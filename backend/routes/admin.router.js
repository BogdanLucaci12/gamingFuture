const express = require('express')

const { logInAdmin, deleteUser, addEmployeeUser } = require('../controllers/adminController/admin.controller')

const adminRouter = express.Router()

adminRouter.use((req, res, next)=>{
    next()
})
adminRouter.get('/', logInAdmin)
adminRouter.delete('/delete', deleteUser)
adminRouter.post('/addEmployeeUser', addEmployeeUser)

module.exports = adminRouter