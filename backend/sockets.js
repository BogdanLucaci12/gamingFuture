function listen(io){
    io.on('connection', (socket) => {
        console.log('Un client s-a conectat.', socket.id);
        console.log('Număr de clienți conectați:', io.engine.clientsCount);
        socket.on('disconnect', () => {
            console.log('Client deconectat.');
        });
    });

}     

module.exports = { listen }