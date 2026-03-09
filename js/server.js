const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// QUAN TRỌNG: Dòng này giúp server tìm thấy file index.html, CSS và JS của bạn
// Vì server.js nằm trong thư mục /js, ta dùng '..' để đi ra ngoài thư mục gốc
app.use(express.static(path.join(__dirname, '..')));

// Điều hướng mặc định về file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});
io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;

        if (numClients === 0) {
            socket.join(roomId);
            socket.emit('joined', { role: 'red', roomId });
        } else if (numClients === 1) {
            socket.join(roomId);
            socket.emit('joined', { role: 'black', roomId });
            // Thông báo cho cả 2 bắt đầu
            io.to(roomId).emit('player-ready');
        } else {
            socket.emit('full', 'Phòng đã đầy!');
        }
    });

    socket.on('move', (data) => {
        // Gửi nước đi tới người kia trong cùng phòng
        socket.to(data.roomId).emit('opponent-move', data.move);
    });
});


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});