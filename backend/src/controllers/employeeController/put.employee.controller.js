const { employeePool } = require('../../configAndConnection/postgres.conexion')
const { capitalizeFirstLetter } = require('../../customFunction/customFunction');
const { uploadPhotoToFirebase } = require('../firebase.controller');
const hashData =require('../../customFunction/cryptData')
const { hashPassword, compareHashPassword }=require('../../customFunction/cryptPassword')

async function updateProductTitle(req, res) {
    try {
        const {productId} = req.params;
        const { title } = req.body
        if(!productId) return res.status(400).send({error:"No product id sent"})
        if(!title) return res.status(400).send({error:"No title sent"})
        await employeePool.query("Update products set title=$1 where id=$2", [title, productId])
        res.status(200).send({ success: "Product title updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function updateDescription(req, res) {
    try {
        const { productId } = req.params;
        const { description } = req.body
        if (!productId) return res.status(400).send({ error: "No product id sent" })
        if (!description) return res.status(400).send({ error: "No description sent" })
        await employeePool.query("Update products set description=$1 where id=$2", [description, productId])
        res.status(200).send({ success: "Product description updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


async function updateProductDetail(req, res) {
    let querySnippet
    try {
        const { productDetailId } = req.params;
        if (!productDetailId) return res.status(400).send({error:"No product detail id sent"})
        const { color, quantity, price } = req.body
        //Define a dinamic query based of some situations
        //It should look like this UPDATE products SET title = $1, description = $2 WHERE product_id = $3
        querySnippet = 'UPDATE product_detail SET '
        //Define an array where it push the params of the color,quantity or price
        const params = []
        //Define an array where it push title = $1, description = $2
        const fieldsToUpdate = []
        if (color) {
            //Using .length to assign the corect number to $
            fieldsToUpdate.push('color = $' + (fieldsToUpdate.length + 1))
            params.push(capitalizeFirstLetter(color))
        }
        if (quantity) {
            fieldsToUpdate.push('quantity = $' + (fieldsToUpdate.length + 1))
            params.push(quantity)
        }
        if (price) {
            if(!Number(price)) return res.status(400).send({error:"Price is not in the correct format"})
            fieldsToUpdate.push('price = $' + (fieldsToUpdate.length + 1))
            params.push(Number(price))
        }
        if (fieldsToUpdate.length === 0) {
            return res.status(400).send({ error: "No fields to update" });
        }
        querySnippet += fieldsToUpdate.join(', ') + ' WHERE id = $' + (fieldsToUpdate.length + 1);
        params.push(parseInt(productDetailId));
        const result = await employeePool.query(querySnippet, params)
        res.status(200).send({ success: "Product updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function updateProductImage(req, res) {
    try {
        const {imageId} = req.params;
        const file = req.file

        if (!file) {
           return res.status(400).send({ error: "File not provided"})
        }
        if(!imageId) { return res.status(400).send({error: "Product image id not provided"})}
        //To not overload firebase check if imageid exist in database postgres
        const verifiedId = await employeePool.query("SELECT product_detail_id, index FROM product_images WHERE id=$1", [imageId])
        const { product_detail_id, index } = verifiedId.rows[0]

        const firebaseUrl = await uploadPhotoToFirebase(file, product_detail_id, index)
        await employeePool.query("UPDATE product_images SET image_url=$1 WHERE id=$2", [firebaseUrl.url, imageId])
        res.status(200).send({ success: "Product updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function updatePasswordEmployee (req, res) {
    try {
        const { username, password, newpassword, confirmnewpassword }=req.body
        if(!username) return res.status(400).send({error:"No user provided"})
        if (!newpassword) return res.status(400).send({error:"No password provided"})
        if (!confirmnewpassword)  return res.status(400).send({ error: "No confirm password provided" }) 
        if (newpassword !== confirmnewpassword)return res.status(400).send({error:"New password doesnt match"})
        const hashedUsername = hashData(username)
        //Retreive password and id from the requested user
        const checkedUsername= await employeePool.query("SELECT password, id from employee_user where username=$1", [hashedUsername])
        const idForUsername=checkedUsername.rows[0].id
        //Check the existance of this user
        if(!idForUsername){throw new Error ("No id found for this username")}
        //Take the current password from db
        const currentPassword = checkedUsername.rows[0].password
        //Compare request password with the one in the db
        const comparedPassword = await compareHashPassword(password, currentPassword)
        if (!comparedPassword) throw new Error ("Current password is not the same as the one in the database")
        // if passwords are the same update the current password
            const hashedPassword = await hashPassword(newpassword)
        await employeePool.query("UPDATE employee_user SET password=$1 where id=$2", [hashedPassword, idForUsername])
        res.status(200).send({success:"Password update succesfully"})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

 async function updateBrandCategorySubcategory (req, res) {
     let querySnippet
     try {
         const {productId} = req.params;
         const { brand, category, subcategory } = req.body
         //Define a dinamic query based of some situations
         //It should look like this UPDATE products SET title = $1, description = $2 WHERE product_id = $3
         querySnippet = 'UPDATE products SET '
         //Define an array where it push the params of the color, quantity or price
         const params = []
         //Define an array where it push title = $1, description = $2
         const fieldsToUpdate = []
         if (brand) {
            const queryBrandId=await employeePool.query("select id from brands where brand_name=$1", [brand])
             const brandId = queryBrandId.rows[0].id
             //Using .lenght to assign the corect number to $
             fieldsToUpdate.push('brand_id = $' + (fieldsToUpdate.length + 1))
             params.push(capitalizeFirstLetter(brandId))
         }
         if (category) {
             const queryCategoryId = await employeePool.query("select id from categories where category_name=$1", [category])
             const categoryId=queryCategoryId.rows[0].id
             fieldsToUpdate.push('category_id = $' + (fieldsToUpdate.length + 1))
             params.push(categoryId)
         }
         if (subcategory) {
             const querySubcategoryId = await employeePool.query("select id from category_description where description=$1", [subcategory])
             const subCategoryId=querySubcategoryId.rows[0].id
             fieldsToUpdate.push('category_description_id = $' + (fieldsToUpdate.length + 1))
             params.push(subCategoryId)
         }
         if (fieldsToUpdate.length === 0) {
             return res.status(400).send({ error: "No fields to update" });
         }
         querySnippet += fieldsToUpdate.join(', ') + ' WHERE id = $' + (fieldsToUpdate.length + 1);
         params.push(productId);
         const result = await employeePool.query(querySnippet, params)
         res.status(200).send({ success: "Product updated successfully" });
     } catch (error) {
         res.status(500).send({ error: error.message });
     }
 }

module.exports = {
    updateProductDetail, 
    updateProductImage, 
    updatePasswordEmployee,
    updateBrandCategorySubcategory,
    updateProductTitle,
    updateDescription
}