const cluster = require('cluster')
const numCPUs = require('os').cpus().length;
const PORT = process.env.PORT || 8626;
const { app } = require('./app')
const sockets = require('./sockets')
const io = require('socket.io')
const http = require('http')


const httpServer = http.createServer(app)
const socketServer = io(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
app.set('io', socketServer);


// if(cluster.isMaster){
//     for(let i=0; i<numCPUs; i++){
//         cluster.fork()
//     }
// }
// else {
httpServer.listen(PORT, () => {
    console.log(`Listening app on ${PORT}`)
})
sockets.listen(socketServer)
// }
