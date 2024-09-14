const express = require('express');
const multer = require('multer');
const employeeRouter = express.Router()
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { addBrand,
    addCategory,
    addProduct,
    addSubCategory,
    addImageForProductDetail,
    addDetailForProduct,
    logInUser,
    verifyToken
 } = require('../controllers/employeeController/post.employee.controller')

const { updateProduct,
    updateProductDetail,
    updateProductImage
} = require('../controllers/employeeController/put.employee.controller');

const {
    deleteBrand,
    deleteCategory,
    deleteSubCategory,
    deleteImageForProductDetail,
    deleteProductDetail,
    deleteProduct
} = require('../controllers/employeeController/delete.employee.controller')

const { getCategoriesAndSubcategory,
    getBrands,
    getAllDetailsByProductid,

} = require('../controllers/employeeController/get.employee.controller')


const { getDistinctProducts,
} = require('../controllers/publicController/get.public.controller')

employeeRouter.post('/logInUser', logInUser)

employeeRouter.use((req, res, next) => {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1];

    // if (token == null) return res.sendStatus(401);

    // jwt.verify(token, process.env.JWT_TOKER_KEY, (err, user) => {
    //     if (err) return res.status(401).send({error:err});
    // });
    next();
})

//Store locally the file
const upload = multer({ storage: multer.memoryStorage() });

employeeRouter.post('/verifyToken', verifyToken)
employeeRouter.post('/addBrand', addBrand);
employeeRouter.post('/addCategory', addCategory)
employeeRouter.post('/addProduct', upload.array('photos', 6), addProduct)
employeeRouter.post('/addSubCategory', addSubCategory)
employeeRouter.post('/addImageForProductDetail/:id', upload.array('photos', 6), addImageForProductDetail)
employeeRouter.post('/addDetailForProduct/:id', upload.array('photos', 6), addDetailForProduct)

employeeRouter.put('/updateProduct/:id', updateProduct)
employeeRouter.put('/updateProductDetail/:id', updateProductDetail)
employeeRouter.put('/updateProductImage/:imageid/productdetail/:productdetailid', upload.single('photos'), updateProductImage)

employeeRouter.delete('/deleteBrand/:brandId', deleteBrand)
employeeRouter.delete('/deleteCategory/:categoryId', deleteCategory)
employeeRouter.delete('/deleteSubCategory/:subCategoryId', deleteSubCategory)
employeeRouter.delete('/deleteImageForProductDetail/:imageId', deleteImageForProductDetail)
employeeRouter.delete('/deleteProductDetail/:productDetailId', deleteProductDetail)
employeeRouter.delete('/deleteProduct/:productId', deleteProduct)

employeeRouter.get('/getCategoriesAndSubcategory', getCategoriesAndSubcategory)
employeeRouter.get('/getBrands', getBrands)
employeeRouter.get('/getDistinctProducts', getDistinctProducts)
employeeRouter.get('/getAllDetailsByProductid/:productId', getAllDetailsByProductid)

module.exports = employeeRouter