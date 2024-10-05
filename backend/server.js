const cluster=require('cluster')
const numCPUs = require('os').cpus().length;
const PORT = process.env.PORT || 8626;
const app=require('./app')

if(cluster.isMaster){
    for(let i=0; i<numCPUs; i++){
        cluster.fork()
    }
}
else {
    app.listen(PORT, ()=>{
        console.log(`Listening on ${PORT}`)
    })
}

