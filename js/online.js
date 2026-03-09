// ========== ONLINE MULTIPLAYER SYSTEM ==========
class OnlineSystem {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.role = null;
        this.isConnected = false;
    }

    connect() {
        return new Promise((resolve, reject) => {

            this.socket = io("https://cotuong2nguoichoi.onrender.com", {
                transports: ["websocket"]
            });

            this.socket.on("connect", () => {
                console.log("Connected:", this.socket.id);
                this.isConnected = true;
                resolve(true);
            });

            this.socket.on("connect_error", (err) => {
                console.log("Connect error:", err);
                reject(false);
            });

            // nhận nước đi đối thủ
            this.socket.on("opponent-move", (move) => {
                this.receiveMove(move);
            });

        });
    }

    joinRoom(roomId) {

        if (!this.socket || !this.isConnected) {
            console.log("Socket chưa kết nối");
            return;
        }

        roomId = String(roomId).trim();
        this.roomId = roomId;

        console.log("Emit join-room:", roomId);

        this.socket.emit("join-room", roomId.trim());

        this.socket.off("joined");
        this.socket.on("joined", (data) => {

            console.log("Server joined:", data);

            // xử lý roomId server gửi object
            let room = data.roomId;
            if (typeof room === "object") {
                room = room.roomId || room.id || JSON.stringify(room);
            }

            this.roomId = room;
            this.role = data.role;

            const info = document.getElementById("roomInfo");
            if (info) {
                info.innerText = "Mã phòng: " + room + " | Bạn: " + data.role;
            }

        });

        this.socket.off("player-ready");
        this.socket.on("player-ready", () => {

            console.log("Game start!");

            const info = document.getElementById("roomInfo");
            if (info) {
                info.innerText += " | Đối thủ đã vào phòng";
            }

            if (window.coTuongGame) {

                window.coTuongGame.isOnline = true;
                window.coTuongGame.vsAI = false;

                // reset game khi bắt đầu online
                if (window.coTuongGame.resetGame) {
                    window.coTuongGame.resetGame();
                }

            }

            const opponent = document.getElementById("opponentName");
            if (opponent) {
                opponent.innerText = "Người chơi Online";
            }

        });

    }

    sendMove(move) {

        if (!this.socket || !this.roomId) return;

        this.socket.emit("move", {
            roomId: String(this.roomId),
            move: move
        });

    }

    receiveMove(move) {

        console.log("Opponent move:", move);

        if (window.coTuongGame && window.coTuongGame.makeMove) {
            window.coTuongGame.makeMove(move);
        }

    }

    sendChatMessage(message) {

        if (!this.socket || !this.roomId) return;

        this.socket.emit("chat", {
            roomId: String(this.roomId),
            message: message
        });

    }

    disconnect() {

        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = null;
        this.roomId = null;
        this.role = null;
        this.isConnected = false;

    }
}

// Global instance
let onlineSystem = new OnlineSystem();

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await onlineSystem.connect();

        console.log("Online ready");

    } catch (err) {

        console.log("Không kết nối được server");

    }

});

// ========== JOIN ROOM ==========
function joinGameRoom() {

    let roomCode = document.getElementById("roomCode").value.trim();

    if (!onlineSystem.isConnected) {
        alert("Chưa kết nối server!");
        return;
    }

    // nếu chưa nhập → tạo phòng
    if (!roomCode) {

        roomCode = Math.floor(1000 + Math.random() * 9000).toString();

        document.getElementById("roomCode").value = roomCode;

        alert("Phòng của bạn: " + roomCode);

    }

    onlineSystem.joinRoom(roomCode);

    console.log("Join room:", roomCode);

}