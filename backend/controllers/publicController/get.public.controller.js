const { publicPool } = require('../../postgres.conexion')

async function getProducts(req, res) {
    try {
        //Query db for all products
        //Query qith distinct because we need unique products, doesnt matter color
        const queryProduct = await publicPool.query(`select distinct pr.title as title, pr.description as description, prImg.image_url as image, 
prCol.color as color, prCol.quantity as quantity, prCol.price as price, br.brand_name as brand,
            cat.category_name as category, subcat.description as subcategory
from products as pr 
inner join product_images as prImg on prImg.product_id = pr.id
inner join product_color as prCol on pr.id = prCol.product_id
inner join brands as br on pr.brands_id = br.id
inner join categories as cat on pr.category_id = cat.id
inner join category_description as subcat on pr.category_description_id = subcat.id
GROUP BY pr.title, pr.description, prCol.color, prCol.quantity, prCol.price,
            br.brand_name, cat.category_name, subcat.description;
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
        const queryCategories = publicPool.query("SELECT * FROM categories")
        if (!queryCategories.rows === 0) { throw new Error("No categories found") }
        res.status(200).send(queryCategories.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
module.exports = { getProducts, getBrands }