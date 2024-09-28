const bucket = require('../configAndConnection/config.firebase')

async function uploadPhotoToFirebase(file, productDetailId, index) {
    try {
        if (!file) {
            return { error: "No file to upload" }
        }

        const fileName = `${productDetailId}-${index}`
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                reject({ error: "Error uploading" });
            });
            blobStream.on('finish', async () => {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(fileName)}`;
                resolve({ url: publicUrl, index });
            });
            blobStream.end(file.buffer);
        });
    }
    catch (error) {
        return { error: error.message }
    }
}

async function deleteFile(productDetailId, index) {
    try {
        if (!productDetailId) { throw new Error("Product detail not provided") }
        if (index === 0) {
            const file = bucket.file(`${productDetailId}-${index}`)
            await file.delete();
            return { success: "File deleted successfully" }
        }
        if (!index) { throw new Error("Index not provided") }
        const file = bucket.file(`${productDetailId}-${index}`)
        await file.delete();
        return { success: "File deleted successfully" }
    }
    catch (error) {
        return { error: error.message }
    }
}
module.exports = { uploadPhotoToFirebase, deleteFile }