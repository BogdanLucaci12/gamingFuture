const { employeePool } = require('../../configAndConnection/postgres.conexion')

async function getCategoriesAndSubcategory(req, res) {
    try {
        //query for categories
        const queryCategoryAndSubcategory = await employeePool.query(`select cat.category_name as category, subcat.description as subcategory
from categories as cat
inner join category_description as subcat on cat.id=subcat.categories_id`)
        if (queryCategoryAndSubcategory.rowCount===0) throw new Error("No categories found")
            
        res.status(200).send(queryCategoryAndSubcategory.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getBrands(req, res) {
    try {
        //Get brands from database
        const queryBrands = await employeePool.query("SELECT brand_name as brand FROM brands")
        if (queryBrands.rowCount === 0) throw new Error("Couldn't find any brands")
            
        return res.status(200).send(queryBrands.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getProduct(req, res) {
    try {
        const { productId } = req.params
        if (!productId) { return res.status(400).send({ error: "No product id provided" }) }
        const queryDetailAboutProduct = await employeePool.query(`select pr.title as title, pr.description as description,
br.brand_name as brand,
cat.category_name as category,
subcat.description as subcategory
from products as pr
inner join brands as br on pr.brand_id = br.id
inner join categories as cat on pr.category_id = cat.id
inner join category_description as subcat on pr.category_description_id = subcat.id
where pr.id=$1`, [productId])
        if (queryDetailAboutProduct.rowCount === 0) { throw new Error("No product found with this id") }
        res.status(200).send(queryDetailAboutProduct.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getAllImageByProductDetail(req, res) {
    try {
        const { productDetailId } = req.params
        if (!productDetailId) { return res.status(400).send({ error: "No product detail id provided" }) }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


async function getCategories(req, res) {
    try {
        //query for categories
        const queryCategoryAndSubcategory = await employeePool.query(`select category_name as category from categories`)
        if (queryCategoryAndSubcategory.rowCount === 0) throw new Error("No categories found")
        res.status(200).send(queryCategoryAndSubcategory.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getProductBySearch(req, res) {
    try {
        const searchParam = req.query.searchParam
        const searchPattern = `%${searchParam}%`;
        console.log(searchParam)
        //Query db for all products but to be distinct
        const queryProduct = await employeePool.query(`SELECT DISTINCT ON (pr.id) 
  pr.id AS id,
  pr.title AS title,
  prImg.image_url AS image,
  br.brand_name AS brand,
  cat.category_name AS category,
  subcat.description AS subcategory
FROM products AS pr 
INNER JOIN product_detail AS prDet ON pr.id = prDet.product_id
INNER JOIN product_images AS prImg ON prImg.product_detail_id = prDet.id
INNER JOIN brands AS br ON pr.brand_id = br.id
INNER JOIN categories AS cat ON pr.category_id = cat.id
INNER JOIN category_description AS subcat ON pr.category_description_id = subcat.id
 WHERE pr.id::text ILIKE $1 
        OR pr.title ILIKE $1 
        OR br.brand_name ILIKE $1 
        OR cat.category_name ILIKE $1 
        OR subcat.description ILIKE $1
ORDER BY pr.id;
`, [searchPattern]);
        if (queryProduct.rowCount === 0) {
            throw new Error("No products found")
        }
        return res.status(200).send(queryProduct.rows)
    }
    catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

async function getProductByCategory(req, res) {
    try {
        const {category} = req.query
        //Query db for all products but to be distinct
        const queryProduct = await employeePool.query(`SELECT DISTINCT ON (pr.id) 
  pr.id AS id,
  pr.title AS title,
  prImg.image_url AS image,
  br.brand_name AS brand,
  cat.category_name AS category,
  subcat.description AS subcategory
FROM products AS pr 
INNER JOIN product_detail AS prDet ON pr.id = prDet.product_id
INNER JOIN product_images AS prImg ON prImg.product_detail_id = prDet.id
INNER JOIN brands AS br ON pr.brand_id = br.id
INNER JOIN categories AS cat ON pr.category_id = cat.id
INNER JOIN category_description AS subcat ON pr.category_description_id = subcat.id
 WHERE  cat.category_name= $1
ORDER BY pr.id;
`, [category]);
        if (queryProduct.rowCount === 0) {
            throw new Error("No products found")
        }
        return res.status(200).send(queryProduct.rows)
    }
    catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

async function getProductBySubcategory(req, res) {
    try {
        const { subcategory, category } = req.query
        //Query db for all products but to be distinct
        const queryProduct = await employeePool.query(`SELECT DISTINCT ON (pr.id) 
  pr.id AS id,
  pr.title AS title,
  prImg.image_url AS image,
  br.brand_name AS brand,
  cat.category_name AS category,
  subcat.description AS subcategory
FROM products AS pr 
INNER JOIN product_detail AS prDet ON pr.id = prDet.product_id
INNER JOIN product_images AS prImg ON prImg.product_detail_id = prDet.id
INNER JOIN brands AS br ON pr.brand_id = br.id
INNER JOIN categories AS cat ON pr.category_id = cat.id
INNER JOIN category_description AS subcat ON pr.category_description_id = subcat.id
 WHERE  subcat.description= $1 and cat.category_name=$2
ORDER BY pr.id;
`, [subcategory, category]);
        if (queryProduct.rowCount === 0) {
            throw new Error("No products found")
        }
        return res.status(200).send(queryProduct.rows)
    }
    catch (error) {
        return res.status(500).send({ error: error.message });
    }
}



async function getProductByBrand(req, res) {
    try {
        const { brand, category ,subcategory } = req.query
        console.log(brand, category, subcategory)
        //Query db for all products but to be distinct
        const queryProduct = await employeePool.query(`SELECT DISTINCT ON (pr.id) 
  pr.id AS id,
  pr.title AS title,
  prImg.image_url AS image,
  br.brand_name AS brand,
  cat.category_name AS category,
  subcat.description AS subcategory
FROM products AS pr 
INNER JOIN product_detail AS prDet ON pr.id = prDet.product_id
INNER JOIN product_images AS prImg ON prImg.product_detail_id = prDet.id
INNER JOIN brands AS br ON pr.brand_id = br.id
INNER JOIN categories AS cat ON pr.category_id = cat.id
INNER JOIN category_description AS subcat ON pr.category_description_id = subcat.id
 WHERE  br.brand_name= $1
 AND (cat.category_name = $2 OR $2 IS NULL OR $2 = '')
    AND (subcat.description = $3 OR $3 IS NULL OR $3 = '')
ORDER BY pr.id;
`, [brand, category, subcategory]);
        if (queryProduct.rowCount === 0) {
            throw new Error("No products found")
        }
        return res.status(200).send(queryProduct.rows)
    }
    catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

async function getProductDetails (req, res) {
    try {
        const {productId}=req.params
        if (!productId) return res.status(400).send({ error: "No product id sent" })
        const queryProductDetail = await employeePool.query("SELECT id, color, quantity, price  from product_detail where product_id=$1 order by id", [productId])
        if(queryProductDetail.rowCount===0) throw new Error("No product detail found")
        res.status(200).send(queryProductDetail.rows)    
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getProductDetailPCQ(req, res) {
    try {
        const { productDetailId } = req.params
        if (!productDetailId) return res.status(400).send({error:"No product detail id sent"})
        const queryProductDetail = await employeePool.query(`SELECT  quantity, price,  color
FROM product_detail
WHERE id = $1;`, [productDetailId])
        if (queryProductDetail.rowCount === 0) throw new Error("No product detail found")
        res.status(200).send(queryProductDetail.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getImageByDetailId (req, res) {
    try {
        const { productDetailId } = req.params
        if (!productDetailId) return res.status(400).send({ error: "No product detail id sent" })
        const queryImages = await employeePool.query(`SELECT id AS imageId, 
       image_url AS imageUrl
from product_images
WHERE  product_detail_id= $1`, [productDetailId])
        if (queryImages.rowCount === 0) throw new Error("No product detail found")
        res.status(200).send(queryImages.rows)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    getCategoriesAndSubcategory,
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
}
