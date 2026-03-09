const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const path = require("path");

const io = new Server(http, {
    cors: {
        origin: "*"
    }
});

app.use(express.static(path.join(__dirname, "../")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    // ===== JOIN ROOM =====
    socket.on("join-room", (roomId) => {

        roomId = String(roomId).trim();

        console.log("Join request:", roomId);

        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;

        console.log("Players in room:", numClients);

        if (numClients === 0) {

            socket.join(roomId);

            socket.emit("joined", {
                role: "red",
                roomId: roomId
            });

            console.log("Player RED joined room", roomId);

        }
        else if (numClients === 1) {

            socket.join(roomId);

            socket.emit("joined", {
                role: "black",
                roomId: roomId
            });

            console.log("Player BLACK joined room", roomId);

            // bắt đầu game
            io.to(roomId).emit("player-ready");

        }
        else {

            socket.emit("full");

            console.log("Room full:", roomId);

        }

    });

    // ===== MOVE =====
    socket.on("move", (data) => {

        if (!data || !data.roomId) return;

        console.log("Move:", data);

        socket.to(data.roomId).emit("opponent-move", data.move);

    });

    // ===== DISCONNECT =====
    socket.on("disconnect", () => {

        console.log("Player disconnected:", socket.id);

    });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {

    console.log("Server running on port", PORT);

});
