const { employeePool, adminPool } = require('../databases.conexion');

async function addProduct(req, res) {
    try {
        const { title, description, price, quantity, color, category, category_description, brand } =req.body
        if(!title) {
            return res.status(400).send({ error: "No title provided" }); 
        }
        if (!description) {
            return res.status(400).send({ error: "No description provided" });
        }
        if (!price) {
            return res.status(400).send({ error: "No price provided" });
        }
        if (!quantity) {
            return res.status(400).send({ error: "No quantity provided" });
        }
        if (!color) {
            return res.status(400).send({ error: "No color provided" });
        }
        if (!category) {
            return res.status(400).send({ error: "No category provided" });
        }
        if (!brand) {
            return res.status(400).send({ error: "No brand provided" });
        }
        if (!category_description) {
            return res.status(400).send({ error: "No brand provided" });
        }
        const categoryId=await employeePool.query("SELECT id FROM categories WHERE category_name = $1", [category])
        if (!categoryId.rows[0].id){
            return res.status(400).send({ error: "No category found" });
        }
        const brandId=await employeePool.query("SELECT id FROM brands WHERE brand_name = $1", [brand])
        if (!brandId.rows[0].id) {
            return res.status(400).send({ error: "No category found" });
        }
        const productId = await employeePool.query("INSERT INTO products(title, description, price, updated_at, category_id, brands_id) VALUES ($1, $2, $3, $4, $5, $6) returning id", [title, description, price, "NOW()", categoryId.rows[0].id, brandId.rows[0].id])
        if(productId.rows[0].id){
            return res.status(200).send({succes:"Produc added with succes"})
        }
        else{
            return res.status(500).send({error:"An error occured during product adding"})
        }
    }
    catch (e) {
        res.status(500).send({ error: "Error encountered: ", message: e.message })
    }
}
async function addBrand(req, res) {
    try {
        const { brandName } = req.body;
        if (!brandName) {
            return res.status(400).send({ error: "No brand name provided" });
        }
        const result = await employeePool.query('SELECT id FROM brands WHERE brand_name=$1', [brandName])
        console.log(result.rowCount)
        if (result.rowCount > 0) {
            return res.status(409).send({ error: "Brand already exists" })
        }
        const brandAdded = await employeePool.query('INSERT INTO brands (brand_name) VALUES ($1) RETURNING id', [brandName])
        if (brandAdded.rows[0].id) {
            return res.status(200).send({ succes: "Brand added with succes" })
        }
        else {
            return res.status(409).send({ error: "An error occured" })
        }
    }
    catch (e) {
        res.status(500).send({ error: "Error encountered: ", message: e.message  })
    }
}

async function addCategory(req, res) {
    try {
        const { categorieName } = req.body;
        if (!categorieName) {
            return res.status(400).send({ error: "No categorie name provided" });
        }
        const result = await employeePool.query('SELECT id FROM categories WHERE category_name=$1', [categorieName])
        if (result.rowCount > 0) {
            return res.status(409).send({ error: "Category already exists" })
        }
        const categorieAdded = await employeePool.query('INSERT INTO categories (category_name) VALUES ($1) RETURNING id', [categorieName])
        if (categorieAdded.rows[0].id) {
            return res.status(200).send({ succes: "CAtegory added with succes" })
        }
        else {
            return res.status(409).send({ error: "An error occured" })
        }
    }
    catch (e) {
        res.status(500).send({ error: "Error encountered: ", message: e.message })
    }
}


module.exports = { addBrand, addCategory, addProduct }