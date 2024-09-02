const express = require('express');
const { addBrand, addCategory, addProduct } = require('../controllers/employee.controller')

const employeeRouter = express.Router()

employeeRouter.use((req, res, next) => {
    next();
})

employeeRouter.post('/addBrand', addBrand);
employeeRouter.post('/addCategory', addCategory)
employeeRouter.post('/addProduct', addProduct)
module.exports = employeeRouter