const { employeePool } = require('../../postgres.conexion');
const uploadPhotoToFirebase = require('../firebase.controller')

async function addProduct(req, res) {
    const client = await employeePool.connect()
    try {
        await client.query('BEGIN')
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ error: "No files provided" });
        }
        //Upload all images in firebase
        const uploadPromises = req.files.map(file => uploadPhotoToFirebase(file));
        //Wait for all upload to complete
        const uploadResults = await Promise.all(uploadPromises);
        //Verified if some of the upload had errors
        const failedUploads = uploadResults.filter(result => result.error);
        if (failedUploads.length > 0) {
            return res.status(400).send({ error: "Error uploading one or more files" });
        }
        //Check if all details about product is sent through body 
        const { title, description, price, quantity, color, category, category_description, brand } = req.body
        if (!title) {
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
        //Check if category id exists in db
        const categoryId = await client.query("SELECT id FROM categories WHERE category_name = $1", [category])
        if (!categoryId.rows[0].id) {
            throw new Error("No category found")
        }
        //Check if brand id exists in db
        const brandId = await client.query("SELECT id FROM brands WHERE brand_name = $1", [brand])
        if (!brandId.rows[0].id) {
            throw new Error("No brand found")
        }
        //Check the subcategory and return the id
        const subCategoryId = await client.query("SELECT id FROM category_description WHERE description=$1", [category_description])
        if (subCategoryId.rowCount === 0) {
            throw new Error("No subcategory found")
        }
        // Insert product in products table
        const productInsertResult = await client.query(
            "INSERT INTO products(title, description, updated_at, category_id, brands_id, category_description_id) VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING id",
            [title, description, categoryId.rows[0].id, brandId.rows[0].id, subCategoryId.rows[0].id]
        );

        const productId = productInsertResult.rows[0].id;
        console.log(productId);
        if (!productId) {
            throw new Error("Failed to insert product");
        }
        // Insert color, price, quantity in db
        const productColorInsertResult = await client.query(
            "INSERT INTO product_color(product_id, color, quantity, price) VALUES ($1, $2, $3, $4) RETURNING id",
            [productId, color, quantity, price]
        )
        const productColorId = productColorInsertResult.rows[0].id;
        if (!productColorId) {
            throw new Error("Error inserting product color");
        }
        //Insert all images url in db but use Promise to wait for all of them to be inserted
        await Promise.all(uploadResults.map(async result =>
            await client.query("INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)", [productId, result.url])
        ))
        //If no error occured commit query
        await client.query('COMMIT')
        return res.status(200).send({ succes: "Product added successfully" })
    }
    catch (error) {
        //if an error occured rollback the query
        await client.query('ROLLBACK');
        res.status(500).send({ error: "Error encountered: ", message: error.message })
    }
    finally {
        client.release()
    }
}

async function addBrand(req, res) {
    try {
        const { brandName } = req.body;
        //Verified if brand name is sent trough the bode
        if (!brandName) {
            return res.status(400).send({ error: "No brand name provided" });
        }
        // verified if brand is not allready in db
        const result = await employeePool.query('SELECT id FROM brands WHERE brand_name=$1', [brandName])
        console.log(result.rowCount)
        if (result.rowCount > 0) {
            return res.status(409).send({ error: "Brand already exists" })
        }
        //Add the new brand in db
        const brandAdded = await employeePool.query('INSERT INTO brands (brand_name) VALUES ($1) RETURNING id', [brandName])
        if (brandAdded.rows[0].id) {
            return res.status(200).send({ succes: "Brand added with succes" })
        }
        else {
            return res.status(409).send({ error: "An error occured" })
        }
    }
    catch (e) {
        res.status(500).send({ error: "Error encountered: ", message: e.message })
    }
}

async function addCategory(req, res) {
    try {
        const { categorieName } = req.body;
        //Verified if categori name is send true the body
        if (!categorieName) {
            return res.status(400).send({ error: "No categorie name provided" });
        }
        //Verified if category name is not allready store in db
        const result = await employeePool.query('SELECT id FROM categories WHERE category_name=$1', [categorieName])
        if (result.rowCount > 0) {
            return res.status(409).send({ error: "Category already exists" })
        }
        //Insert category in the db
        const categorieAdded = await employeePool.query('INSERT INTO categories (category_name) VALUES ($1) RETURNING id', [categorieName])
        if (categorieAdded.rows[0].id) {
            return res.status(200).send({ succes: "Category added with succes" })
        }
        else {
            return res.status(409).send({ error: "An error occured" })
        }
    }
    catch (error) {
        res.status(500).send({ error: "Error encountered: ", message: error.message })
    }
}
async function addSubCategory(req, res) {
    try {
        const { subCategory, category } = req.body
        if (!subCategory) {
            return res.status(404).send({ error: "No sub category provided" })
        }
        //check if category exist
        const checkCategoryId = await employeePool.query("SELECT id FROM categories WHERE category_name=$1", [category])
        const categoryId = checkCategoryId.rows[0].id
        if (!categoryId) {
            throw new Error(`Add ${category} in order to add a subcategory`)
        }
        //If category exist, take id and insert in db along with sub category name
        const insertSubCategory = await employeePool.query("INSERT INTO category_description(categories_id, description) VALUES ($1, $2) returning id", [categoryId, subCategory])
        const subCategoryId = insertSubCategory.rows[0].id
        if (!subCategoryId) {
            throw new Error("Error occurred while adding subcategory")
        }
        else {
            res.status(200).send({ succes: "Subcategory added with succes" })
        }

    }
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}

module.exports = { addBrand, addCategory, addProduct, addSubCategory }