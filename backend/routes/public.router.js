const express=require('express')
const { getProducts, getBrands }=require('../controllers/publicController/get.public.controller')

const publicRouter=express.Router()

publicRouter.get('/products', getProducts)
publicRouter.get('/brands', getBrands)
module.exports = publicRouter