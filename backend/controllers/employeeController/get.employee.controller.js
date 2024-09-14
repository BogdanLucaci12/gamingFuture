const {employeePool} =require('../../postgres.conexion')

async function getCategoriesAndSubcategory (req, res) {
    try {
        //query for categories
        const queryCategoryAndSubcategory = await employeePool.query(`select cat.category_name as category, subcat.description as subcategory
from categories as cat
inner join category_description as subcat on cat.id=subcat.categories_id`)
        if (!queryCategoryAndSubcategory.rows === 0) { throw new Error("No categories found") }
        res.status(200).send(queryCategoryAndSubcategory.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getBrands(req, res) {
    try {
        //Get brands from database
        const queryBrands = await employeePool.query("SELECT * FROM brands")
        if (queryBrands.rows.length === 0) {
            throw new Error("Couldn't find any brands")
        }
        return res.status(200).send(queryBrands.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getAllDetailsByProductid(req, res) {
    try {
       const {productId}=req.params
       if(!productId){return res.status(400).send({error:"No product id provided"})}
        const queryDetailAboutProduct = await employeePool.query(`select pr.id as product_id, pr.title as title, pr.description as description, prImg.image_url as image, 
prDet.color as color, prDet.quantity as quantity, prDet.price as price, br.brand_name as brand,
            cat.category_name as category, subcat.description as subcategory, prDet.id as product_detail_id, prImg.id as product_image_id
from products as pr 
inner join product_detail as prDet on pr.id = prDet.product_id
inner join product_images as prImg on prImg.product_detail_id = prDet.id
inner join brands as br on pr.brand_id = br.id
inner join categories as cat on pr.category_id = cat.id
inner join category_description as subcat on pr.category_description_id = subcat.id
where pr.id=$1`, [productId])
        if(queryDetailAboutProduct.rows.length ===0 ){throw new Error ("No product found with this id")}
        res.status(200).send(queryDetailAboutProduct.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getAllImageByProductDetail (req, res) {
    try {
       const {productDetailId}=req.params
       if(!productDetailId){return res.status(400).send({error:"No product detail id provided"})}
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


module.exports = { getCategoriesAndSubcategory,
    getBrands,
    getAllDetailsByProductid,
 }
