const bucket = require('../config.firebase')

async function uploadPhotoToFirebase(file) {
    try { 
        // Obține fișierul încărcat de multer
        if (!file) {
            return {error:"No file to upload"}
        }

        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                reject({ error: "Error uploading" });
            });
            blobStream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve({ url: publicUrl });
            });
            blobStream.end(file.buffer);
        });
    }
    catch (error) {
        return {error:error.message}
    }
}
module.exports = uploadPhotoToFirebase