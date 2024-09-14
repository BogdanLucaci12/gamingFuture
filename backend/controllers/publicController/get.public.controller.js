const { publicPool } = require('../../postgres.conexion')

async function getDistinctProducts(req, res) {
    try {
        //Query db for all products but to be distinct
        const queryProduct = await publicPool.query(`select distinct on (pr.id) pr.id as product_id, pr.title as title, pr.description as description, prImg.image_url as image, 
prDet.color as color, prDet.quantity as quantity, prDet.price as price, br.brand_name as brand,
            cat.category_name as category, subcat.description as subcategory
from products as pr 
inner join product_detail as prDet on pr.id = prDet.product_id
inner join product_images as prImg on prImg.product_detail_id = prDet.id
inner join brands as br on pr.brand_id = br.id
inner join categories as cat on pr.category_id = cat.id
inner join category_description as subcat on pr.category_description_id = subcat.id
ORDER BY pr.id
`);
        if (queryProduct.rows.length === 0) {
            throw new Error("No products found")
        }
        return res.status(200).send(queryProduct.rows)
    }
    catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

async function getDetailByProductid (req, res) {
    try {
        //Get product with all details about a product and image
        const {productId}=req.params
        if(!productId){return res.status(400).send({error:"Product id not found"})}
        const queryProduct=await publicPool.query(``, [])
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getBrands(req, res) {
    try {
        //Get brands from database
        const queryBrands = await publicPool.query("SELECT * FROM brands")
        if (queryBrands.rows.length === 0) {
            throw new Error("Couldn't find any brands")
        }
        return res.status(200).send(queryBrands.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


async function getCategories(req, res) {
    try {
        //query for categories
        const queryCategories = await publicPool.query("SELECT * FROM categories")
        if (queryCategories.rowCount === 0) { throw new Error("No categories found") }
        res.status(200).send(queryCategories.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


async function getSubCategoryByCategory(req, res) {
    try {
        //query for subcategory
        const {category}=req.query
        if (!category){return res.status(400).send({error:"No category found"})}
        const queryCategories = await publicPool.query(`select cat.category_name as category, subcat.description as subcategory
from categories as cat
inner join category_description as subcat on cat.id=subcat.categories_id
where cat.category_name = $1`, [])
        if (queryCategories.rows.length === 0) { throw new Error("No subcategory found") }
        res.status(200).send(queryCategories.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { getDistinctProducts, 
    getBrands, 
    getCategories, 
    getSubCategoryByCategory,
 }