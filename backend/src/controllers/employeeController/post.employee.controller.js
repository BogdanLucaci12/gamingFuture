const { employeePool, adminPool } = require('../../configAndConnection/postgres.conexion');
const { uploadPhotoToFirebase } = require('../firebase.controller')
const { capitalizeFirstLetter } = require('../../customFunction/customFunction')
const { compareHashPassword } = require('../../customFunction/cryptPassword')
const hashUser = require('../../customFunction/cryptData')
const jwt = require('jsonwebtoken');
require('dotenv').config()
async function addProduct(req, res) {
    const client = await employeePool.connect()
    try {
        await client.query('BEGIN')
        if (!req.files || req.files.length === 0) return res.status(400).send({ error: "No files provided" });

        //Check if all details about product is sent through body 
        const { title, description, price, quantity, color, category, subCategory, brand } = req.body
        if (!title) return res.status(400).send({ error: "No title provided" });

        if (!description) return res.status(400).send({ error: "No description provided" });
        if (!price) return res.status(400).send({ error: "No price provided" });

        if (!quantity)  return res.status(400).send({ error: "No quantity provided" });

        if (!color) return res.status(400).send({ error: "No color provided" });

        if (!category) return res.status(400).send({ error: "No category provided" });
        if (!brand) return res.status(400).send({ error: "No brand provided" });
        if (!subCategory) return res.status(400).send({ error: "No brand provided" });

        //Check if category id exists in db
        const categoryId = await client.query("SELECT id FROM categories WHERE category_name = $1", [category])
        if (categoryId.rowCount === 0) throw new Error("No category found")
        //Check if brand id exists in db
        const brandId = await client.query("SELECT id FROM brands WHERE brand_name = $1", [brand])
        if (brandId.rowCount === 0) throw new Error("No brand found")

        //Check the subcategory and return the id
        const subCategoryId = await client.query("SELECT id FROM category_description WHERE description=$1", [subCategory])
        if (subCategoryId.rowCount === 0) throw new Error("No subcategory found")

        // Insert product in products table
        const productInsertResult = await client.query(
            "INSERT INTO products(title, description, updated_at, category_id, brand_id, category_description_id) VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING id",
            [capitalizeFirstLetter(title), capitalizeFirstLetter(description), categoryId.rows[0].id, brandId.rows[0].id, subCategoryId.rows[0].id]
        );
        const productId = productInsertResult.rows[0].id;
        if (!productId) {
            throw new Error("Failed to insert product");
        }
        const priceToNumber=Number(price)
        // Insert color, price, quantity in db
        const insertProductDetail = await client.query(
            "INSERT INTO product_detail(product_id, color, quantity, price) VALUES ($1, $2, $3, $4) RETURNING id",
            [productId, capitalizeFirstLetter(color), Number(quantity), priceToNumber]
        )
        const productDetailId = insertProductDetail.rows[0].id;
        if (!productDetailId) {
            throw new Error("Error inserting product color");
        }
        if (req.files.length > 7) { throw new Error("No more then 6 images for a product") }
        //Upload all images in firebase
        const uploadPromises = req.files.map(async (file, index) => await uploadPhotoToFirebase(file, productDetailId, index));
        //Wait for all upload to complete
        const uploadResults = await Promise.all(uploadPromises);

        //Verified if some of the upload had errors
        const failedUploads = uploadResults.filter(result => result.error);
        if (failedUploads.length > 0) {
            throw new Error({ error: "Error uploading one or more files" });
        }
        //Insert all images url in db but use Promise to wait for all of them to be inserted
        await Promise.all(uploadResults.map((result) =>
            client.query("INSERT INTO product_images (product_detail_id, image_url, index) VALUES ($1, $2, $3)", [productDetailId, result.url, result.index])
        ))
        //If no error occured commit query
        await client.query('COMMIT')
        return res.status(200).send({ success: "Product added successfully" })
    }
    catch (error) {
        //if an error occured rollback the query
        await client.query('ROLLBACK');
        res.status(500).send({ message: "Error encountered: ", error: error.message })
    }
    finally {
        client.release()
    }
}

async function addBrand(req, res) {
    try {
        const { brand } = req.body;
        //Verified if brand name is sent trough the bode
        if (!brand) {
            return res.status(400).send({ error: "No brand name provided" });
        }
        // verified if brand is not allready in db
        const result = await employeePool.query('SELECT id FROM brands WHERE brand_name=$1', [brand])
        if (result.rowCount > 0) {
            return res.status(409).send({ error: "Brand already exists" })
        }
        //Add the new brand in db
        const brandAdded = await employeePool.query('INSERT INTO brands (brand_name) VALUES ($1) RETURNING id', [capitalizeFirstLetter(brand)])
        if (brandAdded.rows[0].id) {
            return res.status(200).send({ success: "Brand added with succes" })
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
        const { category } = req.body;
        //Verified if categori name is send true the body
        if (!category) return res.status(400).send({ error: "No categorie name provided" });
        //Verified if category name is not allready store in db
        const result = await employeePool.query('SELECT id FROM categories WHERE category_name=$1', [category])
        if (result.rowCount > 0) {
            return res.status(409).send({ error: "Category already exists" })
        }
        //Insert category in the db
        const categorieAdded = await employeePool.query('INSERT INTO categories (category_name) VALUES ($1) RETURNING id', [capitalizeFirstLetter(category)])
        if (categorieAdded.rows[0].id) {
            return res.status(200).send({ success: "Category added with succes" })
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
        const { subcategory, category } = req.body
        if (!subcategory) return res.status(404).send({ error: "No sub category provided" })
        //check if category exist
        const checkCategoryId = await employeePool.query("SELECT id FROM categories WHERE category_name=$1", [category])
        const categoryId = checkCategoryId.rows[0].id
        if (!categoryId) throw new Error(`Add ${category} in order to add a subcategory`)
         //If category exist, take id and insert in db along with sub category name
        const insertSubCategory = await employeePool.query("INSERT INTO category_description(categories_id, description) VALUES ($1, $2) returning id", [categoryId, capitalizeFirstLetter(subcategory)])
        const subCategoryId = insertSubCategory.rows[0].id
        if (!subCategoryId) {
            throw new Error("Error occurred while adding subcategory")
        }
        else {
            res.status(200).send({ success: "Subcategory added with succes" })
        }

    }
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}

async function addImageForProductDetail(req, res) {
    try {
        const {productDetailId} = req.params
        if (!productDetailId) { return res.status(400).send({ error: "No id was provided for a specific image" }) }
        if (!req.files || req.files.length === 0) { return res.status(400).send({ error: "No image provided" }) }
        
        //Verify number of img/id, not bigger then 6
        const queryAllImgForGivenId = await employeePool.query("SELECT prImg.index FROM product_detail as prDet INNER JOIN product_images as prImg ON prDet.id=prImg.product_detail_id where prDet.id=$1", [productDetailId])

        //Check if product has more then 6 images
        const checkQuantityOfImg = parseInt(queryAllImgForGivenId.rowCount)
        if (checkQuantityOfImg >= 6) { return res.status(400).send({ error: "The limit of pictures for this product have exceeded" }) }
        const maxNumberOfImagesForAProd = 6
        const totalNumberOfImages = checkQuantityOfImg + req.files.length
        if (totalNumberOfImages > 7) { throw new Error(`For this product you can insert only ${maxNumberOfImagesForAProd - checkQuantityOfImg} more images`) }

        //Insert image into firebase and retrived url
        const mapThroughEveryImg = req.files.map((file, index) => uploadPhotoToFirebase(file, productDetailId, checkQuantityOfImg + index))
        const awaitPromiseforFirebase = await Promise.all(mapThroughEveryImg)

        //Insert the url in db
        const checkErrorForFirebaseUpload = awaitPromiseforFirebase.filter(firebase => firebase.error)
        if (checkErrorForFirebaseUpload.length > 0) { throw new Error("Error while uploading image") }
        const insertUrlForProduct = awaitPromiseforFirebase.map(async result => await employeePool.query("INSERT INTO product_images(product_detail_id, image_url, index) VALUES ($1, $2, $3)", [productDetailId, result.url, result.index]))
        await Promise.all(insertUrlForProduct)
        res.status(200).send({ success: "Images added successfully" })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function addDetailForProduct(req, res) {
    try {
        const {productId} = req.params
        const { color, price, quantity } = req.body
        if (!req.files && !req.files.length === 0) { return res.status(400).send({ error: "No image provided" }) }
        if (!productId) { return res.status(400).send({ error: "No id was provided" }) }
        if (!color) { return res.status(400).send({ error: "No color was provided" }) }
        if (!price) { return res.status(400).send({ error: "No price was provided" }) }
        if (!quantity) { return res.status(400).send({ error: "No quantity was provided" }) }
        const priceToNumber = Number(price)
        //verified id in db
        console.log(req.files.length)
        if (req.files.length > 7) { return res.status(400).send({ error: "Too many images" }) }
        const checkProductId = await employeePool.query("SELECT id FROM products WHERE id=$1", [productId])
        if (!checkProductId.rows[0].id) { throw new Error("No product with provided id was found") }
        const insertProductDetail = await employeePool.query("INSERT INTO product_detail(product_id, color, quantity, price) VALUES ($1, $2, $3, $4) returning id", [productId, capitalizeFirstLetter(color), Number(quantity), priceToNumber])
        const productDetailId = insertProductDetail.rows[0].id
        if (!productDetailId) { throw new Error("Error occured inserting in product detail") }
        //Upload all images in firebase
        const uploadPromises = req.files.map( (file, index) => uploadPhotoToFirebase(file, productDetailId, index));
        //Wait for all upload to complete
        const uploadResults = await Promise.all(uploadPromises);

        //Verified if some of the upload had errors
        const failedUploads = uploadResults.filter(result => result.error);
        if (failedUploads.length > 0) {
            throw new Error("Error uploading one or more files");
        }
        //Insert all images url in db but use Promise to wait for all of them to be inserted
        await Promise.all(uploadResults.map((result) =>
            employeePool.query("INSERT INTO product_images (product_detail_id, image_url, index) VALUES ($1, $2, $3)", [productDetailId, result.url, result.index])
        ))
        res.status(200).send({ success: "Product specification inserted with succes" })
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function logInUser(req, res) {
    try {
        const { username, password } = req.body
        if (!username) { return res.status(400).send({ error: "No username provided" }) }
        if (!password) { return res.status(400).send({ error: "No password provided" }) }
        const hashingUser = hashUser(username)
        const checkUser = await employeePool.query("Select name, username, password from employee_user where username=$1", [hashingUser])
        if (checkUser.rowCount === 0)  throw new Error("No such user in database")
        const checkPassword = await compareHashPassword(password, checkUser.rows[0].password)
        if (checkPassword.error)  throw new Error(checkPassword.error) 
            const name=checkUser.rows[0].name
        const token = jwt.sign(
            {
                user: name,
            rank:'Employee'
             },
            process.env.JWT_TOKEN_KEY_EMPLOYEE,
            { expiresIn: '1d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,  
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60 * 1000 
        });
        res.status(200).send({ success: "Successfully logged in", name:name, rank:'Employee',token:token})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function logOut (req, res) {
    try {
        const {token}= req.cookies
        const decodedToken = jwt.decode(token)
        const expiryDate = new Date(decodedToken.exp * 1000);
        const resultQuery=await employeePool.query("insert into blacklisted_token (token, expiry_at) values ($1, $2) returning id", [token, expiryDate])
        if(!resultQuery.rows[0].id) throw new Error("Log out fail")  
        res.cookie('token', '', {
            maxAge: 0
        });
        res.status(200).json({ success: 'Logout successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    addBrand,
    addCategory,
    addProduct,
    addSubCategory,
    addImageForProductDetail,
    addDetailForProduct,
    logInUser,
    logOut
}