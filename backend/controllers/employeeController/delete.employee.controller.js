const { employeePool } = require('../../postgres.conexion')
const { deleteFile } = require('../firebase.controller')

async function deleteBrand(req, res) {
    try {
        const { brandId } = req.params
        if (!brandId) { return res.status(400).send({ error: "Brand id not provided" }) }
        //Query the database for products with the same brand id
        const queryProduct = await employeePool.query("SELECT id from products WHERE brand_id=$1", [brandId])
        if (queryProduct.rowCount > 0) {
            throw new Error('You cannot delete brand because other products have this brand and they are not deleted')
        }
        await employeePool.query("DELETE FROM brands WHERE id=$1", [brandId])
        res.status(200).send({ succes: `Brand deleted successfully` })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function deleteCategory(req, res) {
    try {
        const { categoryId } = req.params
        if (!categoryId) { return res.status(400).send({ error: "Category id not provided" }) }
        //Query the database for products with the same category id
        const queryProduct = await employeePool.query("SELECT id from products WHERE category_id=$1", [categoryId])
        if (queryProduct.rowCount > 0) {
            throw new Error('You cannot delete this category because other products have this category and they are not deleted')
        }
        await employeePool.query("DELETE FROM categories WHERE id=$1", [categoryId])
        res.status(200).send({ succes: `Category deleted successfully` })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function deleteSubCategory(req, res) {
    try {
        const { subCategoryId } = req.params
        if (!subCategoryId) { return res.status(400).send({ error: "Sub category id not provided" }) }
        //Query the database for products with the same subcategory id
        const queryProduct = await employeePool.query("SELECT id from products WHERE category_description_id=$1", [subCategoryId])
        if (queryProduct.rowCount > 0) {
            throw new Error('You cannot delete this subcategory because other products have this subcategory and they are not deleted')
        }
        await employeePool.query("DELETE FROM category_description WHERE id=$1", [subCategoryId])
        res.status(200).send({ succes: `Subcategory deleted successfully` })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function deleteImageForProductDetail(req, res) {
    try {
        const { imageId } = req.params
        if (!imageId) { return res.status(400).send({ error: "Brand id not provided" }) }
        //Query the database for  with the same image id
        const queryProductImages = await employeePool.query("SELECT product_detail_id, index FROM product_images WHERE id=$1", [imageId])
        const productDetailId = queryProductImages.rows[0].product_detail_id
        const index = queryProductImages.rows[0].index
        const deleteFromFirebase = await deleteFile(productDetailId, index)
        if (deleteFromFirebase.error) { throw new Error(deleteFromFirebase.error) }
        if (deleteFromFirebase.success) {
            await employeePool.query("DELETE FROM product_images WHERE id=$1", [imageId])
            res.status(200).send({ succes: `Image deleted successfully` })
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function deleteProductDetail(req, res) {
    try {
        const { productDetailId } = req.params
        if (!productDetailId) { return res.status(400).send({ error: "Product detail id not provided" }) }
        const queryIndexAndProductDetailId = await employeePool.query(`
            select prImg.index as index,  prImg.product_detail_id as product_detail_id
            from product_detail as prDet 
            inner join product_images as prImg on prDet.id=prImg.product_detail_id
            where prDet.id=$1`, [productDetailId])
        //Map through the all rows    
        const eraseFirebaseImages = queryIndexAndProductDetailId.rows.map(async (row) => {
            const { index, product_detail_id } = row
            await deleteFile(product_detail_id, index)
        })
        //Wait for all promise to be completed
        await Promise.all(eraseFirebaseImages)
        //Check through the array for any error
        const checkForError = eraseFirebaseImages.filter(list => list.error)
        if (checkForError.error) { throw new Error(checkForError.error) }
        await employeePool.query("DELETE from product_detail WHERE id=$1", [productDetailId])
        res.status(200).send({ succes: 'Product detail deleted successfully' })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function deleteProduct(req, res) {
    try {
        const { productId } = req.params
        if (!productId) { return res.status(400).send({ error: "Product id not provided" }) }
        //Query the index and product detail id for erase the image from firebase
        const queryIndexAndProductDetailId = await employeePool.query(`
            select prImg.index as index,  prImg.product_detail_id as product_detail_id
            from products as pr 
            inner join product_detail as prDet on pr.id=prDet.product_id
            inner join product_images as prImg on prImg.product_detail_id=prDet.id WHERE pr.id=$1`, [productId])
        //Map through the all rows    
        const eraseFirebaseImages=queryIndexAndProductDetailId.rows.map(async (row) =>{
            const {index, product_detail_id} = row
            await deleteFile(product_detail_id, index)
        })
        //Wait for all promise to be completed
        await Promise.all(eraseFirebaseImages)
        //Check through the array for any error
        const checkForError=eraseFirebaseImages.filter(list=>list.error)
        if(checkForError.error){throw new Error(checkForError.error)}
        await employeePool.query("DELETE from products WHERE id=$1", [productId])
        res.status(200).send({ succes: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    deleteBrand,
    deleteCategory,
    deleteSubCategory,
    deleteImageForProductDetail,
    deleteProductDetail,
    deleteProduct
}