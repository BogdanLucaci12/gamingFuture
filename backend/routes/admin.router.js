const express = require('express')

const { logInAdmin, deleteUser, addUserAdmin } = require('../controllers/admin.controller')

const adminRouter = express.Router()

adminRouter.use((req, res, next)=>{
    next()
})
adminRouter.get('/', logInAdmin)
adminRouter.delete('/delete', deleteUser)
adminRouter.post('/add', addUserAdmin)
module.exports = adminRouter