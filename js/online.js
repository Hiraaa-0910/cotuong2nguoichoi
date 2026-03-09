// ========== ONLINE MULTIPLAYER SYSTEM ==========

class OnlineSystem {

    constructor() {
        this.socket = null;
        this.roomId = null;
        this.role = null;
        this.isConnected = false;
    }

    // ================= CONNECT =================
    connect() {

        return new Promise((resolve, reject) => {

            this.socket = io("https://cotuong2nguoichoi.onrender.com", {
                transports: ["websocket"]
            });

            this.socket.on("connect", () => {

                console.log("Connected to server:", this.socket.id);

                this.isConnected = true;

                resolve(true);

            });

            this.socket.on("connect_error", (err) => {

                console.log("Connect error:", err);

                reject(false);

            });

            // nhận nước đi từ đối thủ
            this.socket.on("opponent-move", (move) => {

                console.log("Opponent move:", move);

                if (window.coTuongGame) {
                    window.coTuongGame.makeMove(move);
                }

            });

        });

    }

    // ================= JOIN ROOM =================
    joinRoom(roomId) {

        if (!this.socket || !this.isConnected) {

            console.log("Socket chưa kết nối");

            return;

        }

        roomId = String(roomId).trim();

        this.roomId = roomId;

        console.log("Join room:", roomId);

        this.socket.emit("join-room", roomId);

        // khi join thành công
        this.socket.off("joined");

        this.socket.on("joined", (data) => {

            console.log("Joined room:", data);

            this.role = data.role;

            alert("Bạn là: " + this.role);

        });

        // khi đủ 2 người
        this.socket.off("player-ready");

       this.socket.on("player-ready", () => {

    console.log("Đối thủ đã vào phòng");

    // cập nhật thông tin phòng
    const info = document.getElementById("roomInfo");
    if (info) {
        info.innerText = "Đối thủ đã vào phòng!";
    }

    // đổi tên đối thủ
    const opponent = document.getElementById("opponentName");
    if (opponent) {
        opponent.innerText = "Người chơi Online";
    }

    // tắt AI và chuyển sang online
    if (window.game) {

    window.game.isOnline = true;
    window.game.vsAI = false;

    if (window.game.resetGame) {
        window.game.resetGame();
    }

}

});
        // phòng đầy
        this.socket.off("full");

        this.socket.on("full", () => {

            alert("Phòng đã đầy!");

        });

    }

    // ================= SEND MOVE =================
    sendMove(move) {

        if (!this.socket || !this.roomId) return;

        this.socket.emit("move", {

            roomId: this.roomId,
            move: move

        });

    }

    // ================= CHAT =================
    sendChatMessage(message) {

        if (!this.socket || !this.roomId) return;

        this.socket.emit("chat", {

            roomId: this.roomId,
            message: message

        });

    }

    // ================= DISCONNECT =================
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

// ================= GLOBAL INSTANCE =================

let onlineSystem = new OnlineSystem();

// ================= AUTO CONNECT =================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await onlineSystem.connect();

        console.log("Online ready");

    }
    catch (err) {

        console.log("Không kết nối được server");

    }

});

// ================= JOIN ROOM BUTTON =================

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

}
