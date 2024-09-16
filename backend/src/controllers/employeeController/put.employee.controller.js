const { employeePool } = require('../../configAndConnection/postgres.conexion')
const { capitalizeFirstLetter, checkCorrectPrice } = require('../../customFunction/customFunction');
const { uploadPhotoToFirebase } = require('../firebase.controller');
async function updateProduct(req, res) {
    let querySnippet
    try {
        const productId = req.params.id;
        const { title, description } = req.body
        //Define a dinamic query based of some situations
        //It should look like this UPDATE products SET title = $1, description = $2 WHERE product_id = $3
        querySnippet = 'UPDATE products SET '
        //Define an array where it push the params of the price or description
        const params = []
        //Define an array where it push title = $1, description = $2
        const fieldsToUpdate = [];
        if (title) {
            //Using .lenght to assign the corect number to $
            fieldsToUpdate.push('title = $' + (fieldsToUpdate.length + 1))
            params.push(title)
        }
        if (description) {
            fieldsToUpdate.push('description = $' + (fieldsToUpdate.length + 1))
            params.push(description)
        }
        if (fieldsToUpdate.length === 0) {
            return res.status(400).send({ error: "No fields to update" });
        }
        querySnippet += fieldsToUpdate.join(', ') + ', updated_at = NOW() WHERE id = $' + (fieldsToUpdate.length + 1);
        params.push(parseInt(productId));
        await employeePool.query(querySnippet, params)
        res.status(200).send({ succes: "Product updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function updateProductDetail(req, res) {
    let querySnippet
    try {
        const productColorId = req.params.id;
        const { color, quantity, price } = req.body
        //Define a dinamic query based of some situations
        //It should look like this UPDATE products SET title = $1, description = $2 WHERE product_id = $3
        querySnippet = 'UPDATE product_detail SET '
        //Define an array where it push the params of the color,quantity or price
        const params = []
        //Define an array where it push title = $1, description = $2
        const fieldsToUpdate = []
        if (color) {
            //Using .lenght to assign the corect number to $
            fieldsToUpdate.push('color = $' + (fieldsToUpdate.length + 1))
            params.push(capitalizeFirstLetter(color))
        }
        if (quantity) {
            fieldsToUpdate.push('quantity = $' + (fieldsToUpdate.length + 1))
            params.push(quantity)
        }
        if (price) {
            const resultForCheckingPrice = checkCorrectPrice(price)
            if (resultForCheckingPrice.error) {
                throw new Error(resultForCheckingPrice.error)
            }
            fieldsToUpdate.push('price = $' + (fieldsToUpdate.length + 1))
            params.push(price)
        }
        if (fieldsToUpdate.length === 0) {
            return res.status(400).send({ error: "No fields to update" });
        }
        querySnippet += fieldsToUpdate.join(', ') + ' WHERE id = $' + (fieldsToUpdate.length + 1);
        params.push(parseInt(productColorId));
        const result = await employeePool.query(querySnippet, params)
        res.status(200).send({ succes: "Product updated successfully" });
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
        res.status(200).send({ succes: "Product updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


module.exports = { updateProduct, updateProductDetail, updateProductImage }