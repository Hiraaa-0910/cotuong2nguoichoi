const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "../")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    socket.on("join-room", (roomId) => {

        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;

        console.log("Join request:", roomId, "players:", numClients);

        if (numClients === 0) {

            socket.join(roomId);

            socket.emit("joined", {
                role: "red",
                roomId
            });

            console.log("Player RED joined room", roomId);

        }
        else if (numClients === 1) {

            socket.join(roomId);

            socket.emit("joined", {
                role: "black",
                roomId
            });

            console.log("Player BLACK joined room", roomId);

            // thông báo bắt đầu
            io.to(roomId).emit("player-ready");

        }
        else {

            socket.emit("full");

        }

    });

    socket.on("move", (data) => {

        console.log("Move:", data);

        // gửi nước đi cho đối thủ
        socket.to(data.roomId).emit("opponent-move", data.move);

    });

    socket.on("disconnect", () => {

        console.log("Player disconnected:", socket.id);

    });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log("Server running on port", PORT);
});