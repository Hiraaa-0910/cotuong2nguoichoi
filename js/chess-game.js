// ========== CHESS GAME ENGINE - COMPLETE ==========

class ChessGame {
    constructor() {
        this.boardSize = { rows: 10, cols: 9 };
        this.boardElement = document.getElementById('chessBoard');
        this.currentPlayer = 'red'; // Đỏ đi trước
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.gameActive = true;
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.setupInitialPieces();
        this.setupEventListeners();
        this.updateTurnDisplay();
        console.log("Chess Game initialized! Red moves first.");
    }
    
    // Tạo bàn cờ
    createBoard() {
        this.boardElement.innerHTML = '';
        
        for (let row = 0; row < this.boardSize.rows; row++) {
            for (let col = 0; col < this.boardSize.cols; col++) {
                const square = document.createElement('div');
                square.className = 'board-square';
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Màu ô cờ
                if ((row + col) % 2 === 0) {
                    square.classList.add('light-square');
                } else {
                    square.classList.add('dark-square');
                }
                
                // Sông
                if (row === 4 || row === 5) {
                    square.classList.add('river');
                }
                
                // Cung
                if ((row >= 0 && row <= 2 && col >= 3 && col <= 5) ||
                    (row >= 7 && row <= 9 && col >= 3 && col <= 5)) {
                    square.classList.add('palace');
                }
                
                this.boardElement.appendChild(square);
            }
        }
    }
    
    // Thiết lập quân cờ ban đầu
    setupInitialPieces() {
        // Xóa hết quân cũ
        this.removeAllPieces();
        
        // Vị trí quân cờ ban đầu
        const initialPieces = [
            // Đỏ (hàng 7-9)
            ['車', 9, 0, 'red'], ['馬', 9, 1, 'red'], ['相', 9, 2, 'red'],
            ['仕', 9, 3, 'red'], ['帥', 9, 4, 'red'], ['仕', 9, 5, 'red'],
            ['相', 9, 6, 'red'], ['馬', 9, 7, 'red'], ['車', 9, 8, 'red'],
            ['炮', 7, 1, 'red'], ['炮', 7, 7, 'red'],
            ['兵', 6, 0, 'red'], ['兵', 6, 2, 'red'], ['兵', 6, 4, 'red'],
            ['兵', 6, 6, 'red'], ['兵', 6, 8, 'red'],
            
            // Đen (hàng 0-2)
            ['俥', 0, 0, 'black'], ['傌', 0, 1, 'black'], ['象', 0, 2, 'black'],
            ['士', 0, 3, 'black'], ['將', 0, 4, 'black'], ['士', 0, 5, 'black'],
            ['象', 0, 6, 'black'], ['傌', 0, 7, 'black'], ['俥', 0, 8, 'black'],
            ['砲', 2, 1, 'black'], ['砲', 2, 7, 'black'],
            ['卒', 3, 0, 'black'], ['卒', 3, 2, 'black'], ['卒', 3, 4, 'black'],
            ['卒', 3, 6, 'black'], ['卒', 3, 8, 'black']
        ];
        
        // Đặt quân cờ
        initialPieces.forEach(([type, row, col, color]) => {
            this.createPiece(type, row, col, color);
        });
    }
    
    // Tạo quân cờ
    createPiece(type, row, col, color) {
        const piece = document.createElement('div');
        piece.className = `piece ${color}-piece`;
        piece.textContent = type;
        piece.dataset.type = type;
        piece.dataset.color = color;
        piece.dataset.row = row;
        piece.dataset.col = col;
        
        const square = this.getSquare(row, col);
        if (square) {
            square.appendChild(piece);
        }
        
        return piece;
    }
    
    // Xóa tất cả quân cờ
    removeAllPieces() {
        document.querySelectorAll('.piece').forEach(piece => piece.remove());
    }
    
    // Thiết lập sự kiện
    setupEventListeners() {
        // Click vào ô cờ
        this.boardElement.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const square = e.target.closest('.board-square');
            if (!square) return;
            
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            
            this.handleSquareClick(row, col);
        });
        
        // Click vào quân cờ
        this.boardElement.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const piece = e.target.closest('.piece');
            if (piece) {
                e.stopPropagation();
                
                const row = parseInt(piece.dataset.row);
                const col = parseInt(piece.dataset.col);
                const color = piece.dataset.color;
                
                // Chỉ cho phép chọn quân của người chơi hiện tại
                if (color === this.currentPlayer) {
                    this.selectPiece(row, col, piece);
                } else {
                    this.showMessage("Không phải lượt của bạn!");
                }
            }
        });
    }
    
    // Xử lý click ô cờ
    handleSquareClick(row, col) {
        if (this.selectedPiece) {
            // Kiểm tra xem có phải nước đi hợp lệ không
            const isValidMove = this.validMoves.some(move => 
                move.row === row && move.col === col
            );
            
            if (isValidMove) {
                this.movePiece(row, col);
            } else {
                // Click vào ô trống không phải nước đi hợp lệ
                this.clearSelection();
            }
        }
    }
    
    // Chọn quân cờ
    selectPiece(row, col, piece) {
        // Bỏ chọn quân cũ
        this.clearSelection();
        
        // Chọn quân mới
        this.selectedPiece = { row, col, element: piece };
        piece.classList.add('selected');
        
        // Tính toán và hiển thị nước đi hợp lệ
        this.calculateAndShowValidMoves(row, col, piece);
        
        // Hiển thị thông tin quân
        this.showPieceInfo(piece);
    }
    
    // Tính toán nước đi hợp lệ CHUẨN
    calculateAndShowValidMoves(row, col, piece) {
        this.validMoves = [];
        const type = piece.dataset.type;
        const color = piece.dataset.color;
        
        switch(type) {
            case '帥': // Tướng đỏ
            case '將': // Tướng đen
                this.calculateGeneralMoves(row, col, color);
                break;
                
            case '仕': // Sĩ đỏ
            case '士': // Sĩ đen
                this.calculateAdvisorMoves(row, col, color);
                break;
                
            case '相': // Tượng đỏ
            case '象': // Tượng đen
                this.calculateElephantMoves(row, col, color);
                break;
                
            case '馬': // Mã đỏ
            case '傌': // Mã đen
                this.calculateHorseMoves(row, col, color);
                break;
                
            case '車': // Xe đỏ
            case '俥': // Xe đen
                this.calculateChariotMoves(row, col, color);
                break;
                
            case '炮': // Pháo đỏ
            case '砲': // Pháo đen
                this.calculateCannonMoves(row, col, color);
                break;
                
            case '兵': // Binh đỏ
            case '卒': // Tốt đen
                this.calculatePawnMoves(row, col, color);
                break;
        }
        
        // Hiển thị nước đi hợp lệ
        this.showValidMoves();
    }
    
    // TƯỚNG: Đi 1 ô 4 hướng, trong cung
    calculateGeneralMoves(row, col, color) {
        const directions = [[-1,0],[1,0],[0,-1],[0,1]];
        
        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            
            // Kiểm tra trong cung
            if (this.isInPalace(newRow, newCol, color)) {
                this.addValidMove(newRow, newCol);
            }
        });
    }
    
    // SĨ: Đi chéo 1 ô, trong cung
    calculateAdvisorMoves(row, col, color) {
        const directions = [[-1,-1],[-1,1],[1,-1],[1,1]];
        
        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isInPalace(newRow, newCol, color)) {
                this.addValidMove(newRow, newCol);
            }
        });
    }
    
    // TƯỢNG: Đi chéo 2 ô, không qua sông
    calculateElephantMoves(row, col, color) {
        const directions = [[-2,-2],[-2,2],[2,-2],[2,2]];
        
        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            const blockRow = row + dr/2;
            const blockCol = col + dc/2;
            
            // Kiểm tra trong bàn cờ
            if (this.isValidPosition(newRow, newCol)) {
                // Kiểm tra chân tượng không bị chắn
                if (!this.hasPieceAt(blockRow, blockCol)) {
                    // Kiểm tra không qua sông
                    if ((color === 'red' && newRow >= 5) ||  // Đỏ ở phía dưới
                        (color === 'black' && newRow <= 4)) { // Đen ở phía trên
                        this.addValidMove(newRow, newCol);
                    }
                }
            }
        });
    }
    
    // MÃ: Đi ngựa
    calculateHorseMoves(row, col, color) {
        const horseMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        horseMoves.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol)) {
                // Tìm chân ngựa bị chắn
                let blockRow, blockCol;
                if (Math.abs(dr) === 2) {
                    blockRow = row + dr/2;
                    blockCol = col;
                } else {
                    blockRow = row;
                    blockCol = col + dc/2;
                }
                
                // Nếu chân ngựa không bị chắn
                if (!this.hasPieceAt(blockRow, blockCol)) {
                    this.addValidMove(newRow, newCol);
                }
            }
        });
    }
    
    // XE: Đi thẳng bao xa cũng được
    calculateChariotMoves(row, col, color) {
        // Đi lên
        for (let r = row - 1; r >= 0; r--) {
            if (this.hasPieceAt(r, col)) {
                this.addValidMove(r, col); // Có thể ăn quân
                break;
            }
            this.addValidMove(r, col);
        }
        
        // Đi xuống
        for (let r = row + 1; r < 10; r++) {
            if (this.hasPieceAt(r, col)) {
                this.addValidMove(r, col);
                break;
            }
            this.addValidMove(r, col);
        }
        
        // Đi trái
        for (let c = col - 1; c >= 0; c--) {
            if (this.hasPieceAt(row, c)) {
                this.addValidMove(row, c);
                break;
            }
            this.addValidMove(row, c);
        }
        
        // Đi phải
        for (let c = col + 1; c < 9; c++) {
            if (this.hasPieceAt(row, c)) {
                this.addValidMove(row, c);
                break;
            }
            this.addValidMove(row, c);
        }
    }
    
    // PHÁO: Đi thẳng, ăn quân phải có đệm
    calculateCannonMoves(row, col, color) {
        // Đi lên (không ăn)
        for (let r = row - 1; r >= 0; r--) {
            if (this.hasPieceAt(r, col)) {
                // Tìm quân đệm để ăn
                for (let rr = r - 1; rr >= 0; rr--) {
                    if (this.hasPieceAt(rr, col)) {
                        this.addValidMove(rr, col, true); // Có thể ăn
                        break;
                    }
                }
                break;
            }
            this.addValidMove(r, col);
        }
        
        // Đi xuống (không ăn)
        for (let r = row + 1; r < 10; r++) {
            if (this.hasPieceAt(r, col)) {
                for (let rr = r + 1; rr < 10; rr++) {
                    if (this.hasPieceAt(rr, col)) {
                        this.addValidMove(rr, col, true);
                        break;
                    }
                }
                break;
            }
            this.addValidMove(r, col);
        }
        
        // Đi trái (không ăn)
        for (let c = col - 1; c >= 0; c--) {
            if (this.hasPieceAt(row, c)) {
                for (let cc = c - 1; cc >= 0; cc--) {
                    if (this.hasPieceAt(row, cc)) {
                        this.addValidMove(row, cc, true);
                        break;
                    }
                }
                break;
            }
            this.addValidMove(row, c);
        }
        
        // Đi phải (không ăn)
        for (let c = col + 1; c < 9; c++) {
            if (this.hasPieceAt(row, c)) {
                for (let cc = c + 1; cc < 9; cc++) {
                    if (this.hasPieceAt(row, cc)) {
                        this.addValidMove(row, cc, true);
                        break;
                    }
                }
                break;
            }
            this.addValidMove(row, c);
        }
    }
    
    // TỐT: Đi thẳng, qua sông đi ngang
    calculatePawnMoves(row, col, color) {
        if (color === 'red') {
            // Đỏ đi lên
            if (row > 0) {
                this.addValidMove(row - 1, col);
            }
            
            // Đã qua sông (hàng 0-4)
            if (row <= 4) {
                if (col > 0) this.addValidMove(row, col - 1);
                if (col < 8) this.addValidMove(row, col + 1);
            }
        } else {
            // Đen đi xuống
            if (row < 9) {
                this.addValidMove(row + 1, col);
            }
            
            // Đã qua sông (hàng 5-9)
            if (row >= 5) {
                if (col > 0) this.addValidMove(row, col - 1);
                if (col < 8) this.addValidMove(row, col + 1);
            }
        }
    }
    
    // Thêm nước đi hợp lệ
    addValidMove(row, col, isCapture = false) {
        if (this.isValidPosition(row, col)) {
            const pieceAtTarget = this.getPieceAt(row, col);
            
            // Kiểm tra nếu có quân ở vị trí đích
            if (pieceAtTarget) {
                // Chỉ thêm nếu là quân đối phương
                if (pieceAtTarget.dataset.color !== this.currentPlayer) {
                    this.validMoves.push({ row, col, isCapture: true });
                }
            } else {
                this.validMoves.push({ row, col, isCapture });
            }
        }
    }
    
    // Hiển thị nước đi hợp lệ
    showValidMoves() {
        this.clearValidMoveHighlights();
        
        this.validMoves.forEach(move => {
            const square = this.getSquare(move.row, move.col);
            if (square) {
                square.classList.add('valid-move');
                if (move.isCapture) {
                    square.classList.add('capture');
                }
            }
        });
    }
    
    
    // Di chuyển quân cờ
    movePiece(toRow, toCol) {
        if (!this.selectedPiece) return;
        
        const fromRow = this.selectedPiece.row;
        const fromCol = this.selectedPiece.col;
        const piece = this.selectedPiece.element;
        
        // Kiểm tra quân đích
        const targetPiece = this.getPieceAt(toRow, toCol);
        
        // Xử lý ăn quân
        if (targetPiece) {
            this.capturePiece(targetPiece);
        }
        
        // Di chuyển quân
        const toSquare = this.getSquare(toRow, toCol);
        const fromSquare = this.getSquare(fromRow, fromCol);
        
        // Animation di chuyển
        piece.style.transition = 'all 0.3s ease';
        piece.style.transform = `translate(${(toCol - fromCol) * 100}%, ${(toRow - fromRow) * 100}%)`;
        
        setTimeout(() => {
            // Hoàn tất di chuyển
            piece.style.transition = '';
            piece.style.transform = '';
            toSquare.appendChild(piece);
            
            // Cập nhật data
            piece.dataset.row = toRow;
            piece.dataset.col = toCol;
            
            // Cập nhật lịch sử
            this.addMoveToHistory(fromRow, fromCol, toRow, toCol);
            
            // ĐỔI LƯỢT TỰ ĐỘNG
            this.switchTurn();
            
            // Xóa selection
            this.clearSelection();
            
            // Kiểm tra chiếu tướng
            this.checkForCheck();
            
        }, 300);
    }
    
    // Ăn quân
    capturePiece(piece) {
        const color = piece.dataset.color;
        const capturedArea = color === 'red' 
            ? document.getElementById('capturedRed')
            : document.getElementById('capturedBlack');
        
        if (capturedArea) {
            const capturedIcon = document.createElement('div');
            capturedIcon.className = 'captured-piece';
            capturedIcon.textContent = piece.textContent;
            capturedArea.appendChild(capturedIcon);
        }
        
        // Kiểm tra nếu là TƯỚNG thì kết thúc game
        if (piece.dataset.type === '帥' || piece.dataset.type === '將') {
            this.endGame(color === 'red' ? 'black' : 'red');
        }
        
        piece.remove();
    }
    
    // ĐỔI LƯỢT - QUAN TRỌNG
    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        
        // Cập nhật hiển thị lượt
        this.updateTurnDisplay();
        
        // Thông báo
        this.showMessage(`Lượt của ${this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN'}`);
        
        // Nếu chơi với AI và đến lượt đen
        if (this.playWithAI && this.currentPlayer === this.aiColor) {
    setTimeout(() => {
        this.makeAIMove();
    }, 500);
        }
    }
    
    // Cập nhật hiển thị lượt
    updateTurnDisplay() {
        const turnElement = document.getElementById('currentTurn');
        const statusElement = document.getElementById('gameStatus');
        
        if (turnElement) {
            turnElement.textContent = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
            turnElement.className = this.currentPlayer === 'red' ? 'red-turn' : 'black-turn';
        }
        
        if (statusElement) {
            statusElement.textContent = this.currentPlayer === 'red' ? 'ĐỎ ĐANG ĐI' : 'ĐEN ĐANG ĐI';
        }
    }
    
    // Xóa selection
    clearSelection() {
        if (this.selectedPiece) {
            this.selectedPiece.element.classList.remove('selected');
            this.selectedPiece = null;
        }
        
        this.clearValidMoveHighlights();
        this.validMoves = [];
    }
    
    // Xóa highlight nước đi
    clearValidMoveHighlights() {
        document.querySelectorAll('.valid-move').forEach(square => {
            square.classList.remove('valid-move', 'capture');
        });
    }
    
    // Thêm nước đi vào lịch sử
    addMoveToHistory(fromRow, fromCol, toRow, toCol) {
        const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const fromNotation = `${columns[fromCol]}${9 - fromRow}`;
        const toNotation = `${columns[toCol]}${9 - toRow}`;
        const player = this.currentPlayer === 'red' ? 'Đỏ' : 'Đen';
        const moveNumber = Math.floor(this.moveHistory.length / 2) + 1;
        
        const move = {
            number: moveNumber,
            player: player,
            from: fromNotation,
            to: toNotation,
            full: `${fromNotation} → ${toNotation}`
        };
        
        this.moveHistory.push(move);
        this.updateMoveHistoryDisplay();
    }
    
    // Cập nhật hiển thị lịch sử
    updateMoveHistoryDisplay() {
        const historyElement = document.getElementById('moveHistory');
        if (!historyElement) return;
        
        historyElement.innerHTML = '';
        
        this.moveHistory.forEach((move, index) => {
            const item = document.createElement('div');
            item.className = 'move-history-item';
            item.innerHTML = `
                <span class="move-number">${move.number}.</span>
                <span class="move-player">${move.player}:</span>
                <span class="move-notation">${move.full}</span>
            `;
            historyElement.appendChild(item);
        });
        
        // Scroll xuống cuối
        historyElement.scrollTop = historyElement.scrollHeight;
    }
    
    // Kiểm tra chiếu tướng
    checkForCheck() {
        // Logic kiểm tra chiếu tướng (có thể thêm sau)
    }
    
    // Kết thúc game
    endGame(winner) {
        this.gameActive = false;
        
        const winnerName = winner === 'red' ? 'ĐỎ' : 'ĐEN';
        this.showMessage(`CHIẾN THẮNG! ${winnerName} thắng!`, 'success');
        
        // Hiển thị modal kết quả
        this.showResultModal(winner);
    }
    
    // Hiển thị modal kết quả
    showResultModal(winner) {
        const modal = document.getElementById('resultModal');
        if (!modal) return;
        
        const icon = document.getElementById('resultIcon');
        const message = document.getElementById('resultMessage');
        const details = document.getElementById('resultDetails');
        
        if (winner === 'red') {
            icon.innerHTML = '<i class="fas fa-crown" style="color: #C62828;"></i>';
            message.textContent = 'ĐỎ CHIẾN THẮNG!';
            message.style.color = '#C62828';
        } else {
            icon.innerHTML = '<i class="fas fa-crown" style="color: #212121;"></i>';
            message.textContent = 'ĐEN CHIẾN THẮNG!';
            message.style.color = '#212121';
        }
        
        details.textContent = `Sau ${this.moveHistory.length} nước đi`;
        
        modal.style.display = 'flex';
    }
    
    // Helper functions
    getSquare(row, col) {
        return document.querySelector(`.board-square[data-row="${row}"][data-col="${col}"]`);
    }
    
    getPieceAt(row, col) {
        const square = this.getSquare(row, col);
        if (!square) return null;
        return square.querySelector('.piece');
    }
    
    hasPieceAt(row, col) {
        return !!this.getPieceAt(row, col);
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < 10 && col >= 0 && col < 9;
    }
    
    isInPalace(row, col, color) {
        if (!this.isValidPosition(row, col)) return false;
        
        if (color === 'red') {
            // Cung đỏ (hàng 7-9, cột 3-5)
            return row >= 7 && row <= 9 && col >= 3 && col <= 5;
        } else {
            // Cung đen (hàng 0-2, cột 3-5)
            return row >= 0 && row <= 2 && col >= 3 && col <= 5;
        }
    }
    
    showMessage(message, type = 'info') {
        if (typeof toastr !== 'undefined') {
            if (type === 'success') {
                toastr.success(message);
            } else {
                toastr.info(message);
            }
        } else {
            console.log(message);
            
            // Hiển thị message tạm
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10000;
            `;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            
            setTimeout(() => messageDiv.remove(), 3000);
        }
    }
    
    showPieceInfo(piece) {
        const pieceNames = {
            '帥': 'Tướng Đỏ', '將': 'Tướng Đen',
            '仕': 'Sĩ Đỏ', '士': 'Sĩ Đen',
            '相': 'Tượng Đỏ', '象': 'Tượng Đen',
            '馬': 'Mã Đỏ', '傌': 'Mã Đen',
            '車': 'Xe Đỏ', '俥': 'Xe Đen',
            '炮': 'Pháo Đỏ', '砲': 'Pháo Đen',
            '兵': 'Binh Đỏ', '卒': 'Tốt Đen'
        };
        
        const name = pieceNames[piece.dataset.type] || piece.dataset.type;
        this.showMessage(`Đã chọn: ${name}`);
    }
    
    // Reset game
    resetGame() {
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
        this.gameActive = true;
        
        // Xóa quân cờ cũ
        this.removeAllPieces();
        
        // Tạo bàn cờ mới
        this.createBoard();
        this.setupInitialPieces();
        
        // Xóa quân bị ăn
        const capturedRed = document.getElementById('capturedRed');
        const capturedBlack = document.getElementById('capturedBlack');
        if (capturedRed) capturedRed.innerHTML = '';
        if (capturedBlack) capturedBlack.innerHTML = '';
        
        // Xóa lịch sử
        const historyElement = document.getElementById('moveHistory');
        if (historyElement) historyElement.innerHTML = '';
        
        // Cập nhật lượt
        this.updateTurnDisplay();
        
        // Ẩn modal kết quả
        const modal = document.getElementById('resultModal');
        if (modal) modal.style.display = 'none';
        
        this.showMessage("Bắt đầu ván mới! Đỏ đi trước.", 'success');
    }
}

// Khởi tạo game
let chessGameInstance;

// DISABLED: This initialization is handled by hoan-chinh-co-tuong.js to avoid conflicts
/*
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Chess Game...");
    
    // Đợi DOM load hoàn tất
    setTimeout(() => {
        chessGameInstance = new ChessGame();
        console.log("Chess Game ready!");
        
        // Gắn sự kiện cho các nút
        setupGameControls();
    }, 500);
}); // DISABLED: End of commented-out chess-game.js initialization
*/

// Thiết lập controls
function setupGameControls() {
    // Nút New Game
    const newGameBtn = document.querySelector('[onclick*="newGame"]');
    if (newGameBtn) {
        newGameBtn.onclick = function() {
            if (chessGameInstance) {
                chessGameInstance.resetGame();
            }
        };
    }
    
    // Nút Undo
    const undoBtn = document.querySelector('[onclick*="undoMove"]');
    if (undoBtn) {
        undoBtn.onclick = function() {
            // Có thể thêm chức năng undo sau
            chessGameInstance.showMessage("Chức năng Undo đang phát triển");
        };
    }
    
    // Nút Hint
    const hintBtn = document.querySelector('[onclick*="showHint"]');
    if (hintBtn) {
        hintBtn.onclick = function() {
            showHint();
        };
    }
}

// Gợi ý nước đi
function showHint() {
    if (!chessGameInstance || !chessGameInstance.gameActive) return;
    
    const currentPlayer = chessGameInstance.currentPlayer;
    const pieces = document.querySelectorAll(`.${currentPlayer}-piece`);
    
    if (pieces.length === 0) return;
    
    // Chọn random một quân
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const row = parseInt(randomPiece.dataset.row);
    const col = parseInt(randomPiece.dataset.col);
    
    // Chọn quân đó
    chessGameInstance.selectPiece(row, col, randomPiece);
    
    // Hiển thị gợi ý
    chessGameInstance.showMessage("Gợi ý: Hãy di chuyển quân này!");
}

// Export để sử dụng global
window.chessGame = chessGameInstance;
window.newGame = function() {
    if (chessGameInstance) chessGameInstance.resetGame();
};
window.showHint = showHint;