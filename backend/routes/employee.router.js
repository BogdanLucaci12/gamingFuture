const express = require('express');
const { addBrand, addCategory, addProduct, addSubCategory } = require('../controllers/employeeController/insert.employee.controller')
const multer = require('multer');
const employeeRouter = express.Router()

employeeRouter.use((req, res, next) => {
    next();
})
//Store locally the file
const upload = multer({ storage: multer.memoryStorage() });

employeeRouter.post('/addBrand', addBrand);
employeeRouter.post('/addCategory', addCategory)
employeeRouter.post('/addProduct', upload.array('photos', 6), addProduct)
employeeRouter.post('/addSubCategory', addSubCategory)

module.exports = employeeRouter