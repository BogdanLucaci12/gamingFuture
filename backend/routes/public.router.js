const express=require('express')
const { getDistinctProducts, 
    getBrands,
    getCategories,
    getSubCategoryByCategory
}=require('../controllers/publicController/get.public.controller')

const publicRouter=express.Router()



publicRouter.get('/getDistinctProducts', getDistinctProducts)
publicRouter.get('/getBrands', getBrands)
publicRouter.get('/getCategories', getCategories)
publicRouter.get('/getSubCategoryByCategory', getSubCategoryByCategory)
module.exports = publicRouter