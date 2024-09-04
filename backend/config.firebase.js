const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const config =require('./creds');

initializeApp({
    credential: cert(config),
    storageBucket:"gs://gamingfuture-688ff.appspot.com"
});

const bucket = getStorage().bucket();

module.exports = bucket