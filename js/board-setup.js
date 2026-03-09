// ========== CHESS BOARD SETUP ==========

class ChessBoardSetup {
    constructor() {
        this.boardElement = document.getElementById('chessBoard');
        this.boardSize = { rows: 10, cols: 9 };
        this.selectedPiece = null;
        this.currentPlayer = 'red'; // red đi trước
        this.pieces = [];
        
        if (this.boardElement) {
            this.createBoard();
            this.setupPieces();
            this.setupEventListeners();
        }
    }
    
    // Tạo bàn cờ 10x9
    createBoard() {
        this.boardElement.innerHTML = '';
        
        // Tạo các ô cờ
        for (let row = 0; row < this.boardSize.rows; row++) {
            for (let col = 0; col < this.boardSize.cols; col++) {
                const square = document.createElement('div');
                square.className = 'board-square';
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Đặt màu ô (giống bàn cờ tướng)
                if ((row + col) % 2 === 0) {
                    square.classList.add('light-square');
                } else {
                    square.classList.add('dark-square');
                }
                
                // Thêm sông ở giữa
                if (row === 4 || row === 5) {
                    square.classList.add('river-area');
                }
                
                // Thêm cung
                if ((row >= 0 && row <= 2 && col >= 3 && col <= 5) ||
                    (row >= 7 && row <= 9 && col >= 3 && col <= 5)) {
                    square.classList.add('palace');
                }
                
                this.boardElement.appendChild(square);
            }
        }
    }
    
    // Thiết lập quân cờ ban đầu
    setupPieces() {
        // Xóa quân cờ cũ
        this.pieces = [];
        
        // Định nghĩa vị trí quân cờ ban đầu
        const initialSetup = {
            // Đỏ (dưới cùng - row 0-2)
            'red': [
                { type: '車', row: 0, col: 0 },
                { type: '馬', row: 0, col: 1 },
                { type: '相', row: 0, col: 2 },
                { type: '仕', row: 0, col: 3 },
                { type: '帥', row: 0, col: 4 },
                { type: '仕', row: 0, col: 5 },
                { type: '相', row: 0, col: 6 },
                { type: '馬', row: 0, col: 7 },
                { type: '車', row: 0, col: 8 },
                { type: '炮', row: 2, col: 1 },
                { type: '炮', row: 2, col: 7 },
                { type: '兵', row: 3, col: 0 },
                { type: '兵', row: 3, col: 2 },
                { type: '兵', row: 3, col: 4 },
                { type: '兵', row: 3, col: 6 },
                { type: '兵', row: 3, col: 8 }
            ],
            // Đen (trên cùng - row 7-9)
            'black': [
                { type: '俥', row: 9, col: 0 },
                { type: '傌', row: 9, col: 1 },
                { type: '象', row: 9, col: 2 },
                { type: '士', row: 9, col: 3 },
                { type: '將', row: 9, col: 4 },
                { type: '士', row: 9, col: 5 },
                { type: '象', row: 9, col: 6 },
                { type: '傌', row: 9, col: 7 },
                { type: '俥', row: 9, col: 8 },
                { type: '砲', row: 7, col: 1 },
                { type: '砲', row: 7, col: 7 },
                { type: '卒', row: 6, col: 0 },
                { type: '卒', row: 6, col: 2 },
                { type: '卒', row: 6, col: 4 },
                { type: '卒', row: 6, col: 6 },
                { type: '卒', row: 6, col: 8 }
            ]
        };
        
        // Tạo quân cờ cho cả 2 bên
        ['red', 'black'].forEach(color => {
            initialSetup[color].forEach(pieceData => {
                this.createPiece(pieceData.type, pieceData.row, pieceData.col, color);
            });
        });
    }
    
    // Tạo một quân cờ
    createPiece(type, row, col, color) {
        const piece = document.createElement('div');
        piece.className = `piece ${color}-piece`;
        piece.textContent = type;
        piece.dataset.type = type;
        piece.dataset.color = color;
        piece.dataset.row = row;
        piece.dataset.col = col;
        
        // Thêm vào bàn cờ
        const square = this.getSquare(row, col);
        if (square) {
            square.appendChild(piece);
            this.pieces.push({
                element: piece,
                type: type,
                color: color,
                row: row,
                col: col
            });
        }
        
        return piece;
    }
    
    // Thiết lập sự kiện
    setupEventListeners() {
        // Click vào ô cờ
        this.boardElement.addEventListener('click', (e) => {
            const square = e.target.closest('.board-square');
            if (!square) return;
            
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            
            this.handleSquareClick(row, col, square);
        });
    }
    
    // Xử lý click vào ô cờ
    handleSquareClick(row, col, square) {
        const piece = this.getPieceAt(row, col);
        
        if (this.selectedPiece) {
            // Đã chọn quân, click để di chuyển
            this.movePiece(row, col);
        } else if (piece) {
            // Chọn quân mới
            this.selectPiece(piece, row, col);
        }
    }
    
    // Chọn quân cờ
    selectPiece(piece, row, col) {
        const pieceColor = piece.dataset.color;
        
        // Kiểm tra lượt
        if (pieceColor !== this.currentPlayer) {
            this.showMessage(`Không phải lượt của ${pieceColor === 'red' ? 'ĐỎ' : 'ĐEN'}!`);
            return;
        }
        
        // Bỏ chọn quân cũ
        this.clearSelection();
        
        // Chọn quân mới
        this.selectedPiece = {
            element: piece,
            type: piece.dataset.type,
            color: pieceColor,
            row: row,
            col: col
        };
        
        piece.classList.add('selected');
        
        // Hiển thị nước đi hợp lệ
        this.showValidMoves(row, col, piece);
        
        // Hiển thị thông tin quân
        this.showPieceInfo(piece);
    }
    
    // Hiển thị nước đi hợp lệ
    showValidMoves(row, col, piece) {
        const moves = this.calculateValidMoves(row, col, piece);
        
        moves.forEach(move => {
            const square = this.getSquare(move.row, move.col);
            if (square) {
                square.classList.add('valid-move');
                if (move.isCapture) {
                    square.classList.add('capture');
                }
            }
        });
    }
    
    // Tính toán nước đi hợp lệ (đơn giản hóa)
    calculateValidMoves(row, col, piece) {
        const moves = [];
        const type = piece.dataset.type;
        const color = piece.dataset.color;
        
        // Các hướng di chuyển cơ bản
        const directions = {
            '帥': ['up', 'down', 'left', 'right'], // Tướng
            '將': ['up', 'down', 'left', 'right'],
            '仕': ['up-left', 'up-right', 'down-left', 'down-right'], // Sĩ
            '士': ['up-left', 'up-right', 'down-left', 'down-right'],
            '相': ['up2-left2', 'up2-right2', 'down2-left2', 'down2-right2'], // Tượng
            '象': ['up2-left2', 'up2-right2', 'down2-left2', 'down2-right2'],
            '馬': [ // Mã
                {dr: 2, dc: 1}, {dr: 2, dc: -1},
                {dr: -2, dc: 1}, {dr: -2, dc: -1},
                {dr: 1, dc: 2}, {dr: 1, dc: -2},
                {dr: -1, dc: 2}, {dr: -1, dc: -2}
            ],
            '傌': [
                {dr: 2, dc: 1}, {dr: 2, dc: -1},
                {dr: -2, dc: 1}, {dr: -2, dc: -1},
                {dr: 1, dc: 2}, {dr: 1, dc: -2},
                {dr: -1, dc: 2}, {dr: -1, dc: -2}
            ]
        };
        
        // Logic di chuyển đơn giản
        switch(type) {
            case '帥':
            case '將':
                // Đi 1 ô 4 hướng, trong cung
                [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isInPalace(newRow, newCol, color)) {
                        moves.push({row: newRow, col: newCol});
                    }
                });
                break;
                
            case '仕':
            case '士':
                // Đi chéo 1 ô, trong cung
                [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isInPalace(newRow, newCol, color)) {
                        moves.push({row: newRow, col: newCol});
                    }
                });
                break;
                
            case '相':
            case '象':
                // Đi chéo 2 ô, không qua sông
                [[-2,-2],[-2,2],[2,-2],[2,2]].forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const middleRow = row + dr/2;
                    const middleCol = col + dc/2;
                    
                    if (this.isValidPosition(newRow, newCol) &&
                        !this.hasPieceAt(middleRow, middleCol) &&
                        ((color === 'red' && newRow <= 4) || (color === 'black' && newRow >= 5))) {
                        moves.push({row: newRow, col: newCol});
                    }
                });
                break;
                
            case '馬':
            case '傌':
                // Mã đi ngựa
                const horseMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                
                horseMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const blockRow = row + Math.sign(dr) * (Math.abs(dr) > 1 ? 1 : 0);
                    const blockCol = col + Math.sign(dc) * (Math.abs(dc) > 1 ? 1 : 0);
                    
                    if (this.isValidPosition(newRow, newCol) &&
                        !this.hasPieceAt(blockRow, blockCol)) {
                        moves.push({row: newRow, col: newCol});
                    }
                });
                break;
                
            case '車':
            case '俥':
                // Xe đi thẳng
                // Lên
                for (let r = row - 1; r >= 0; r--) {
                    if (this.hasPieceAt(r, col)) break;
                    moves.push({row: r, col: col});
                }
                // Xuống
                for (let r = row + 1; r < 10; r++) {
                    if (this.hasPieceAt(r, col)) break;
                    moves.push({row: r, col: col});
                }
                // Trái
                for (let c = col - 1; c >= 0; c--) {
                    if (this.hasPieceAt(row, c)) break;
                    moves.push({row: row, col: c});
                }
                // Phải
                for (let c = col + 1; c < 9; c++) {
                    if (this.hasPieceAt(row, c)) break;
                    moves.push({row: row, col: c});
                }
                break;
                
            case '炮':
            case '砲':
                // Pháo đi thẳng, ăn phải có đệm
                // Đơn giản: chỉ đi không ăn
                [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isValidPosition(newRow, newCol) && !this.hasPieceAt(newRow, newCol)) {
                        moves.push({row: newRow, col: newCol});
                    }
                });
                break;
                
            case '兵':
            case '卒':
                // Tốt: đi thẳng, qua sông đi ngang
                if (color === 'red') {
                    // Đỏ đi lên
                    if (row > 0) moves.push({row: row-1, col: col});
                    if (row <= 4) { // Đã qua sông
                        if (col > 0) moves.push({row: row, col: col-1});
                        if (col < 8) moves.push({row: row, col: col+1});
                    }
                } else {
                    // Đen đi xuống
                    if (row < 9) moves.push({row: row+1, col: col});
                    if (row >= 5) { // Đã qua sông
                        if (col > 0) moves.push({row: row, col: col-1});
                        if (col < 8) moves.push({row: row, col: col+1});
                    }
                }
                break;
        }
        
        // Lọc nước đi hợp lệ và thêm thông tin capture
        return moves.filter(move => {
            if (!this.isValidPosition(move.row, move.col)) return false;
            
            const targetPiece = this.getPieceAt(move.row, move.col);
            if (targetPiece) {
                // Có quân ở đích đến
                if (targetPiece.dataset.color !== color) {
                    move.isCapture = true;
                    return true;
                }
                return false;
            }
            return true;
        });
    }
    
    // Di chuyển quân cờ
    movePiece(toRow, toCol) {
        if (!this.selectedPiece) return;
        
        const fromRow = this.selectedPiece.row;
        const fromCol = this.selectedPiece.col;
        const piece = this.selectedPiece.element;
        
        // Kiểm tra nước đi hợp lệ
        const isValid = Array.from(document.querySelectorAll('.valid-move')).some(square => {
            return parseInt(square.dataset.row) === toRow && 
                   parseInt(square.dataset.col) === toCol;
        });
        
        if (!isValid) {
            this.showMessage("Nước đi không hợp lệ!");
            return;
        }
        
        // Kiểm tra có ăn quân không
        const targetPiece = this.getPieceAt(toRow, toCol);
        if (targetPiece) {
            // Xử lý ăn quân
            this.capturePiece(targetPiece);
        }
        
        // Di chuyển quân
        const toSquare = this.getSquare(toRow, toCol);
        const fromSquare = this.getSquare(fromRow, fromCol);
        
        // Animation di chuyển
        piece.style.transition = 'transform 0.3s ease';
        piece.style.transform = `translate(${(toCol - fromCol) * 100}%, ${(toRow - fromRow) * 100}%)`;
        
        setTimeout(() => {
            // Cập nhật vị trí
            piece.style.transition = '';
            piece.style.transform = '';
            toSquare.appendChild(piece);
            
            // Cập nhật dữ liệu
            piece.dataset.row = toRow;
            piece.dataset.col = toCol;
            this.selectedPiece.row = toRow;
            this.selectedPiece.col = toCol;
            
            // Cập nhật lượt
            this.switchTurn();
            
            // Xóa selection
            this.clearSelection();
            
            // Cập nhật lịch sử
            this.updateMoveHistory(fromRow, fromCol, toRow, toCol);
            
        }, 300);
    }
    
    // Ăn quân
    capturePiece(piece) {
        // Thêm vào khu vực quân bị ăn
        const capturedArea = piece.dataset.color === 'red' 
            ? document.getElementById('capturedRed')
            : document.getElementById('capturedBlack');
        
        if (capturedArea) {
            const capturedIcon = document.createElement('div');
            capturedIcon.className = 'captured-piece';
            capturedIcon.textContent = piece.textContent;
            capturedArea.appendChild(capturedIcon);
        }
        
        // Xóa khỏi bàn cờ
        piece.remove();
        
        // Xóa khỏi danh sách pieces
        this.pieces = this.pieces.filter(p => p.element !== piece);
    }
    
    // Đổi lượt
    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        
        // Cập nhật hiển thị
        const turnElement = document.getElementById('currentTurn');
        if (turnElement) {
            turnElement.textContent = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
            turnElement.className = this.currentPlayer === 'red' ? 'red-turn' : 'black-turn';
        }
        
        // Cập nhật game status
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = this.currentPlayer === 'red' ? 'ĐỎ ĐANG ĐI' : 'ĐEN ĐANG ĐI';
        }
        
        // Hiển thị thông báo
        this.showMessage(`Lượt của ${this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN'}`);
    }
    
    // Xóa selection
    clearSelection() {
        if (this.selectedPiece) {
            this.selectedPiece.element.classList.remove('selected');
            this.selectedPiece = null;
        }
        
        // Xóa highlight nước đi
        document.querySelectorAll('.valid-move').forEach(square => {
            square.classList.remove('valid-move', 'capture');
        });
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
            // Cung đỏ (hàng 0-2, cột 3-5)
            return row >= 0 && row <= 2 && col >= 3 && col <= 5;
        } else {
            // Cung đen (hàng 7-9, cột 3-5)
            return row >= 7 && row <= 9 && col >= 3 && col <= 5;
        }
    }
    
    showMessage(message) {
        if (typeof toastr !== 'undefined') {
            toastr.info(message);
        } else {
            console.log(message);
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
    
    updateMoveHistory(fromRow, fromCol, toRow, toCol) {
        const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const fromNotation = `${columns[fromCol]}${9 - fromRow}`;
        const toNotation = `${columns[toCol]}${9 - toRow}`;
        const moveText = `${fromNotation} → ${toNotation}`;
        
        const historyElement = document.getElementById('moveHistory');
        if (historyElement) {
            const moveItem = document.createElement('div');
            moveItem.className = 'move-history-item';
            moveItem.textContent = `${historyElement.children.length + 1}. ${moveText}`;
            historyElement.appendChild(moveItem);
            
            // Scroll xuống cuối
            historyElement.scrollTop = historyElement.scrollHeight;
        }
    }
    
    // Reset bàn cờ
    resetBoard() {
        this.clearSelection();
        this.currentPlayer = 'red';
        this.createBoard();
        this.setupPieces();
        
        // Xóa quân bị ăn
        const capturedRed = document.getElementById('capturedRed');
        const capturedBlack = document.getElementById('capturedBlack');
        if (capturedRed) capturedRed.innerHTML = '';
        if (capturedBlack) capturedBlack.innerHTML = '';
        
        // Xóa lịch sử
        const historyElement = document.getElementById('moveHistory');
        if (historyElement) historyElement.innerHTML = '';
        
        // Cập nhật lượt
        const turnElement = document.getElementById('currentTurn');
        if (turnElement) {
            turnElement.textContent = 'ĐỎ';
            turnElement.className = 'red-turn';
        }
        
        this.showMessage("Bàn cờ đã được reset!");
    }
}

// Khởi tạo khi trang load
let chessBoard;

document.addEventListener('DOMContentLoaded', function() {
    console.log("⚠️ board-setup.js initialization skipped to avoid conflicts with hoan-chinh-co-tuong.js");
    return;
});

// Export để sử dụng global
window.chessBoard = chessBoard;