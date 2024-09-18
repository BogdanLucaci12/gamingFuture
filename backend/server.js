const fs=require('fs')
const https = require('https')
const http=require('http')
const cluster=require('cluster')
const numCPUs = require('os').cpus().length;
const PORT=8626;
const app=require('./app')

// if(cluster.isMaster){
//     for(let i=0; i<numCPUs; i++){
//         cluster.fork()
//     }
// }
// else {
    // https.createServer({
    //         cert:fs.readFileSync('cert.pem'),
    //         key:fs.readFileSync('key.pem')
    // }, app).listen(PORT, ()=>{
    //     console.log(`Listening on ${PORT}`)
    // })
app.listen(PORT, ()=>{
    console.log(`Listening on post ${PORT}`)
})
// }

