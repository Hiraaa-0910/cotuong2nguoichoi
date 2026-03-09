const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
    cors: {
        origin: "*"
    }
});

const path = require("path");

// lưu trạng thái phòng
let rooms = {};

app.use(express.static(path.join(__dirname, "../")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    // ================= JOIN ROOM =================
   socket.on("join-room", (roomId) => {

    roomId = String(roomId).trim();

    console.log("Join request:", roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;

    console.log("Players in room:", numClients);

    if (numClients === 0) {

        socket.join(roomId);

        socket.emit("joined", {
            roomId: roomId,
            role: "red"
        });

        console.log("Player 1 joined");

    }
    else if (numClients === 1) {

        socket.join(roomId);

        socket.emit("joined", {
            roomId: roomId,
            role: "black"
        });

        io.to(roomId).emit("player-ready");

        console.log("Player 2 joined");

    }
    else {

        socket.emit("full", "Phòng đã đầy!");

    }

});

    // ================= MOVE =================
    socket.on("move", (data) => {

        if (!data.roomId) return;

        console.log("Move:", data);

        socket.to(data.roomId).emit("opponent-move", data.move);

    });

    // ================= CHAT =================
    socket.on("chat", (data) => {

        if (!data.roomId) return;

        socket.to(data.roomId).emit("chat", data.message);

    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {

        console.log("Player disconnected:", socket.id);

        for (let roomId in rooms) {

            rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);

            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            } else {
                io.to(roomId).emit("opponent-left");
            }

        }

    });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {

    console.log("Server running on port", PORT);

});