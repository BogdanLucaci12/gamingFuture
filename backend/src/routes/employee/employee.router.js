const express = require('express');
const multer = require('multer');
const employeeRouter = express.Router()
const { verifyTokenEmployee } = require('../../customFunction/verifyToken')
const jwt = require('jsonwebtoken');

require('dotenv').config()

const { addBrand,
    addCategory,
    addProduct,
    addSubCategory,
    addImageForProductDetail,
    addDetailForProduct,
    logInUser,
    logOut
} = require('../../controllers/employeeController/post.employee.controller')

const { 
    updateProductDetail,
    updateProductImage,
    updatePasswordEmployee,
    updateBrandCategorySubcategory,
    updateProductTitle,
    updateDescription
} = require('../../controllers/employeeController/put.employee.controller');

const {
    deleteBrand,
    deleteCategory,
    deleteSubCategory,
    deleteImageForProductDetail,
    deleteProductDetail,
    deleteProduct
} = require('../../controllers/employeeController/delete.employee.controller')

const { getCategoriesAndSubcategory,
    getBrands,
    getProduct,
    getCategories,
    getProductBySearch,
    getProductByCategory,
    getProductBySubcategory,
    getProductByBrand,
    getProductDetails,
    getProductDetailPCQ,
    getImageByDetailId
} = require('../../controllers/employeeController/get.employee.controller')


const { getDistinctProducts,
} = require('../../controllers/publicController/get.public.controller')

employeeRouter.post('/logInUser', logInUser)

employeeRouter.use((req, res, next) => {
    const token = req.cookies.token;
    if (token == null) return res.status(401).send({ error: "Not authenticated" });
    try {
        //check employee token
        jwt.verify(token, process.env.JWT_TOKEN_KEY_EMPLOYEE);
        return next();
    } catch (err) {
            //check admin token
        try {
            jwt.verify(token, process.env.JWT_TOKEN_KEY_ADMIN);
            return next();
        } catch (err) {
            return res.status(403).cookie('token', '', { maxAge: 0 }).send({ error: "Invalid token" });
        }
    }
})

//Store locally the file
const upload = multer({ storage: multer.memoryStorage() });

employeeRouter.post('/verifyToken', verifyTokenEmployee)
employeeRouter.post('/addBrand', addBrand);
employeeRouter.post('/addCategory', addCategory)
employeeRouter.post('/addProduct', upload.array('photos', 6), addProduct)
employeeRouter.post('/addSubCategory', addSubCategory)
employeeRouter.post('/addImageForProductDetail/:productDetailId', upload.array('photos', 6), addImageForProductDetail)
employeeRouter.post('/addDetailForProduct/:id', upload.array('photos', 6), addDetailForProduct)
employeeRouter.post('/logOut', logOut)

employeeRouter.put('/updateProductTitle/:productId', updateProductTitle)
employeeRouter.put('/updatedescription/:productId', updateDescription)
employeeRouter.put('/updateProductDetail/:id', updateProductDetail)
employeeRouter.put('/updateProductImage/:imageid', upload.single('photos'), updateProductImage)
employeeRouter.put('/updatePasswordEmployee', updatePasswordEmployee)
employeeRouter.put('/updateBrandCategorySubcategory/:productId', updateBrandCategorySubcategory)

employeeRouter.delete('/deleteBrand/:brandId', deleteBrand)
employeeRouter.delete('/deleteCategory/:categoryId', deleteCategory)
employeeRouter.delete('/deleteSubCategory/:subCategoryId', deleteSubCategory)
employeeRouter.delete('/deleteImageForProductDetail/:imageId', deleteImageForProductDetail)
employeeRouter.delete('/deleteProductDetail/:productDetailId', deleteProductDetail)
employeeRouter.delete('/deleteProduct/:productId', deleteProduct)

employeeRouter.get('/getCategoriesAndSubcategory', getCategoriesAndSubcategory)
employeeRouter.get('/getBrands', getBrands)
employeeRouter.get('/getDistinctProducts', getDistinctProducts)
employeeRouter.get('/getProduct/:productId', getProduct)
employeeRouter.get('/getCategories', getCategories)
employeeRouter.get('/getProductBySearch', getProductBySearch)
employeeRouter.get('/getProductByCategory', getProductByCategory)
employeeRouter.get('/getProductBySubcategory', getProductBySubcategory)
employeeRouter.get('/getProductByBrand', getProductByBrand)
employeeRouter.get('/getProductDetails/:productId', getProductDetails)
employeeRouter.get('/getProductDetailPCQ/:productDetailId', getProductDetailPCQ)
employeeRouter.get('/getImageByDetailId/:productDetailId', getImageByDetailId)

module.exports = employeeRouter