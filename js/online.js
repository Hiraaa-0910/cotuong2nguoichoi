// ========== ONLINE MULTIPLAYER SYSTEM ==========
class OnlineSystem {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.opponent = null;
        this.matchmaking = false;
            this.isConnected = false;
    }

   connect() {
    return new Promise((resolve, reject) => {

        this.socket = io("https://cotuong2nguoichoi.onrender.com", {
    transports: ["websocket"]
});

        this.socket.on("connect", () => {
            console.log("Connected to server");
            this.isConnected = true;
            resolve(true);
        });

        this.socket.on("connect_error", () => {
            reject(false);
        });

        this.socket.on("opponent-move", (move) => {
            this.receiveMove(move);
        });

    });
}
   joinRoom(roomId) {

    if (!this.socket) {
        console.log("Socket chưa kết nối");
        return;
    }

    this.roomId = roomId;

    this.socket.emit("join-room", roomId);

    this.socket.off("joined");
    this.socket.on("joined", (data) => {
        console.log("Joined room:", data);
    });

    this.socket.off("player-ready");
    this.socket.on("player-ready", () => {
        console.log("Game start!");
    });
}

    sendMove(move) {
        if (!this.socket) return;

        this.socket.emit("move", {
            roomId: this.roomId,
            move: move
        });
    }

    receiveMove(move) {
        console.log("Opponent move:", move);

        if (window.coTuongGame) {
            window.coTuongGame.makeMove(move);
        }
    }

    sendChatMessage(message) {
        if (!this.socket || !this.roomId) return;

        this.socket.emit("chat", {
            roomId: this.roomId,
            message: message
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = null;
        this.roomId = null;
        this.opponent = null;
        this.matchmaking = false;
    }
}

// Create global instance
let onlineSystem = new OnlineSystem();
document.addEventListener("DOMContentLoaded", async () => {

    try {

        await onlineSystem.connect();

        console.log("Online ready");

    } catch (err) {

        console.log("Không kết nối được server");

    }

});
function joinGameRoom() {

    const roomCode = document.getElementById("roomCode").value.trim();

    if (!roomCode) {
        alert("Nhập mã phòng!");
        return;
    }

    if (!onlineSystem.isConnected) {
        alert("Chưa kết nối server!");
        return;
    }

    onlineSystem.joinRoom(roomCode);

    console.log("Join room:", roomCode);
}