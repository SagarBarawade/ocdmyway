const coreService = require('../services/coreService');

const socketMiddleware = {};

socketMiddleware.socketIO = ((io) => {

    io.on('connection', socket => {

        socket.on('disconnect', (data) => {
            console.log('DISCONNECT: ' + data);
        });

        socket.on('PINGB', (msg) => {
            console.log('SOCKET IS CONNECTED: Browser says, ' + msg);
            socket.emit('PINGS', 'HELLO BROWSER...!');
        });

        socket.on('GAMEON', (msg) => {

            console.log('GAMEON: ' + msg);

            let arr = msg.toString().split("#");
            ParamsObject = { userId: arr[0], gameId: arr[1], card: arr[2], cardNo: arr[3] };
            //console.log(ParamsObject);
            coreService.dropCardToCardHolder(ParamsObject, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    message = 'Good Move: ' + arr[3];
                    socket.emit('ACKN', message);
                }
            });
        });
    });
});

module.exports = socketMiddleware;