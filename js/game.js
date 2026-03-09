// ========== MAIN GAME LOGIC ==========

// Thêm class SimpleChessMove vào file game.js
class SimpleChessMove {
    constructor() {
        this.selectedPiece = null;
        this.currentPlayer = 'red';
        this.validMoves = [];
        
        this.setupMoveSystem();
    }

    setupMoveSystem() {
        // Đợi board được tạo xong
        setTimeout(() => {
            this.bindPieceEvents();
        }, 100);
    }

    bindPieceEvents() {
        // Gắn sự kiện click cho tất cả quân cờ
        document.addEventListener('click', (e) => {
            const piece = e.target.closest('.piece');
            const cell = e.target.closest('.cell');
            
            if (piece && piece.dataset.color === this.currentPlayer) {
                this.selectPiece(piece);
            } else if (cell && this.selectedPiece) {
                this.moveToCell(cell);
            } else if (cell && !this.selectedPiece) {
                // Nếu click vào ô trống và có quân cờ đang được chọn
                const pieceInCell = cell.querySelector('.piece');
                if (pieceInCell && pieceInCell.dataset.color === this.currentPlayer) {
                    this.selectPiece(pieceInCell);
                }
            }
        });
    }

    selectPiece(piece) {
        // Xóa selection cũ
        if (this.selectedPiece) {
            this.selectedPiece.classList.remove('selected');
            this.clearMoveIndicators();
        }
        
        // Chọn quân cờ mới
        this.selectedPiece = piece;
        piece.classList.add('selected');
        
        // Tính toán và hiển thị nước đi hợp lệ
        const x = parseInt(piece.dataset.x);
        const y = parseInt(piece.dataset.y);
        const type = piece.dataset.type;
        const color = piece.dataset.color;
        
        this.validMoves = this.calculateValidMoves(type, color, x, y);
        this.showValidMoves();
        
        console.log(`Selected ${color} ${type} at (${x}, ${y})`);
    }

    calculateValidMoves(type, color, x, y) {
        // Hàm đơn giản - bạn có thể mở rộng sau
        const moves = [];
        const isRed = color === 'red';
        
        switch(type) {
            case 'pawn': // Tốt
                if (isRed) {
                    // Đỏ đi lên
                    if (y > 0) moves.push({x: x, y: y-1});
                    // Sau khi qua sông có thể đi ngang
                    if (y <= 4) {
                        if (x > 0) moves.push({x: x-1, y: y});
                        if (x < 8) moves.push({x: x+1, y: y});
                    }
                } else {
                    // Đen đi xuống
                    if (y < 9) moves.push({x: x, y: y+1});
                    if (y >= 5) {
                        if (x > 0) moves.push({x: x-1, y: y});
                        if (x < 8) moves.push({x: x+1, y: y});
                    }
                }
                break;
                
            case 'rook': // Xe
                // Đi thẳng
                for (let i = 0; i < 9; i++) {
                    if (i !== x) moves.push({x: i, y: y});
                    if (i !== y) moves.push({x: x, y: i});
                }
                break;
                
            case 'horse': // Mã
                // Đi hình chữ L
                const horseMoves = [
                    {dx: -1, dy: -2}, {dx: 1, dy: -2},
                    {dx: -2, dy: -1}, {dx: 2, dy: -1},
                    {dx: -2, dy: 1}, {dx: 2, dy: 1},
                    {dx: -1, dy: 2}, {dx: 1, dy: 2}
                ];
                horseMoves.forEach(move => {
                    const newX = x + move.dx;
                    const newY = y + move.dy;
                    if (newX >= 0 && newX < 9 && newY >= 0 && newY < 10) {
                        moves.push({x: newX, y: newY});
                    }
                });
                break;
                
            // Thêm các quân cờ khác ở đây...
        }
        
        return moves;
    }

    showValidMoves() {
        this.clearMoveIndicators();
        
        this.validMoves.forEach(move => {
            const cell = document.querySelector(`.cell[data-x="${move.x}"][data-y="${move.y}"]`);
            if (cell) {
                const indicator = document.createElement('div');
                indicator.className = 'move-indicator';
                indicator.style.cssText = `
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    background: rgba(0, 255, 0, 0.3);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    cursor: pointer;
                    z-index: 5;
                `;
                indicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.moveToCell(cell);
                });
                cell.appendChild(indicator);
            }
        });
    }

    clearMoveIndicators() {
        document.querySelectorAll('.move-indicator').forEach(indicator => {
            indicator.remove();
        });
    }

    moveToCell(cell) {
        if (!this.selectedPiece || !this.validMoves) return;
        
        const toX = parseInt(cell.dataset.x);
        const toY = parseInt(cell.dataset.y);
        
        // Kiểm tra xem nước đi có hợp lệ không
        const isValidMove = this.validMoves.some(move => move.x === toX && move.y === toY);
        
        if (isValidMove) {
            // Di chuyển quân cờ
            const piece = this.selectedPiece;
            
            // Kiểm tra nếu có quân cờ đối phương ở vị trí đích
            const existingPiece = cell.querySelector('.piece');
            if (existingPiece) {
                existingPiece.remove(); // Ăn quân
            }
            
            // Cập nhật vị trí
            piece.dataset.x = toX;
            piece.dataset.y = toY;
            cell.appendChild(piece);
            
            // Đổi lượt
            this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
            
            // Cập nhật UI
            this.updateTurnDisplay();
            
            console.log(`Moved piece to (${toX}, ${toY})`);
        }
        
        // Xóa selection
        piece.classList.remove('selected');
        this.selectedPiece = null;
        this.clearMoveIndicators();
    }

    updateTurnDisplay() {
        const turnElement = document.getElementById('currentTurn');
        if (turnElement) {
            turnElement.textContent = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
            turnElement.style.color = this.currentPlayer === 'red' ? 'red' : 'black';
        }
    }
}

// Thêm vào phần khởi tạo game trong game.js
let chessMoveSystem;

function initGame() {
    // ... code hiện tại ...
    
    // Thêm dòng này để khởi tạo hệ thống di chuyển
    chessMoveSystem = new SimpleChessMove();
    
    // ... code hiện tại ...
}class ChessGame {
    constructor() {
        this.state = {
            board: [],
            currentPlayer: 'red',
            selectedPiece: null,
            gameMode: 'ai',
            aiLevel: 3,
            gameStatus: 'playing',
            timeRemaining: { red: 600, black: 600 },
            moveHistory: [],
            validMoves: [],
            isCheck: false,
            capturedPieces: { red: [], black: [] },
            score: 0,
            soundEnabled: true,
            musicEnabled: true,
            gameStarted: false,
            draggingPiece: null,
            dragOffset: { x: 0, y: 0 }
        };

        this.init();
    }

    init() {
        this.createBoard();
        this.renderBoard();
        this.setupEventListeners();
        this.updateGameInfo();
        this.startTimer();
        this.loadGameSettings();
        console.log('Game initialized');
    }

    createBoard() {
        // Tạo bàn cờ 9x10
        this.state.board = Array(10).fill().map(() => Array(9).fill(null));
        
        // ====== BÊN ĐEN (TRÊN) ======
        // Hàng 1
        this.placePiece('俥', 0, 0, 'black');   // Xe trái
        this.placePiece('傌', 1, 0, 'black');   // Mã trái
        this.placePiece('象', 2, 0, 'black');   // Tượng trái
        this.placePiece('士', 3, 0, 'black');   // Sĩ trái
        this.placePiece('將', 4, 0, 'black');   // Tướng
        this.placePiece('士', 5, 0, 'black');   // Sĩ phải
        this.placePiece('象', 6, 0, 'black');   // Tượng phải
        this.placePiece('傌', 7, 0, 'black');   // Mã phải
        this.placePiece('俥', 8, 0, 'black');   // Xe phải
        
        // Hàng 3 - Pháo
        this.placePiece('砲', 1, 2, 'black');
        this.placePiece('砲', 7, 2, 'black');
        
        // Hàng 4 - Tốt
        this.placePiece('卒', 0, 3, 'black');
        this.placePiece('卒', 2, 3, 'black');
        this.placePiece('卒', 4, 3, 'black');
        this.placePiece('卒', 6, 3, 'black');
        this.placePiece('卒', 8, 3, 'black');
        
        // ====== BÊN ĐỎ (DƯỚI) ======
        // Hàng 10
        this.placePiece('車', 0, 9, 'red');
        this.placePiece('馬', 1, 9, 'red');
        this.placePiece('相', 2, 9, 'red');
        this.placePiece('仕', 3, 9, 'red');
        this.placePiece('帥', 4, 9, 'red');
        this.placePiece('仕', 5, 9, 'red');
        this.placePiece('相', 6, 9, 'red');
        this.placePiece('馬', 7, 9, 'red');
        this.placePiece('車', 8, 9, 'red');
        
        // Hàng 8 - Pháo
        this.placePiece('炮', 1, 7, 'red');
        this.placePiece('炮', 7, 7, 'red');
        
        // Hàng 7 - Binh
        this.placePiece('兵', 0, 6, 'red');
        this.placePiece('兵', 2, 6, 'red');
        this.placePiece('兵', 4, 6, 'red');
        this.placePiece('兵', 6, 6, 'red');
        this.placePiece('兵', 8, 6, 'red');
    }

    placePiece(piece, x, y, color) {
        this.state.board[y][x] = {
            piece: piece,
            color: color,
            x: x,
            y: y,
            type: this.getPieceType(piece),
            value: this.getPieceValue(piece)
        };
    }

    getPieceType(piece) {
        const pieceTypes = {
            '帥': 'king', '將': 'king',
            '仕': 'advisor', '士': 'advisor',
            '相': 'elephant', '象': 'elephant',
            '馬': 'horse', '傌': 'horse',
            '車': 'chariot', '俥': 'chariot',
            '炮': 'cannon', '砲': 'cannon',
            '兵': 'soldier', '卒': 'soldier'
        };
        return pieceTypes[piece] || 'unknown';
    }

    getPieceValue(piece) {
        const values = {
            'king': 1000,
            'advisor': 20,
            'elephant': 20,
            'horse': 45,
            'chariot': 90,
            'cannon': 45,
            'soldier': 10
        };
        return values[this.getPieceType(piece)] || 0;
    }

    renderBoard() {
        const board = document.getElementById('chessBoard');
        if (!board) return;

        board.innerHTML = '';
        
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Màu ô xen kẽ
                if ((x + y) % 2 === 0) {
                    cell.style.background = 'rgba(255, 255, 255, 0.1)';
                }
                
                const piece = this.state.board[y][x];
                if (piece) {
                    const pieceDiv = document.createElement('div');
                    pieceDiv.className = `piece ${piece.color}`;
                    pieceDiv.textContent = piece.piece;
                    pieceDiv.dataset.x = x;
                    pieceDiv.dataset.y = y;
                    
                    // Highlight nếu được chọn
                    if (this.state.selectedPiece && 
                        this.state.selectedPiece.x === x && 
                        this.state.selectedPiece.y === y) {
                        cell.style.background = 'rgba(255, 215, 0, 0.3)';
                        pieceDiv.classList.add('selected');
                    }
                    
                    cell.appendChild(pieceDiv);
                }
                
                board.appendChild(cell);
            }
        }
    }
    

    setupEventListeners() {
        const board = document.getElementById('chessBoard');
        if (!board) return;

        // Click to select piece
        board.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            const piece = this.state.board[y][x];
            
            if (this.state.selectedPiece) {
                // Try to move
                this.movePiece(this.state.selectedPiece.x, this.state.selectedPiece.y, x, y);
            } else if (piece && piece.color === this.state.currentPlayer) {
                // Select piece
                this.selectPiece(x, y);
            }
        });

        // Drag and drop
        board.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Touch events for mobile
        board.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleMouseDown(e) {
        const piece = e.target.closest('.piece');
        if (!piece) return;
        
        const cell = piece.parentElement;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const pieceData = this.state.board[y][x];
        
        if (!pieceData || pieceData.color !== this.state.currentPlayer) return;
        
        this.state.draggingPiece = piece;
        this.state.selectedPiece = pieceData;
        
        const rect = piece.getBoundingClientRect();
        this.state.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        piece.classList.add('dragging');
        piece.style.position = 'fixed';
        piece.style.zIndex = '1000';
        
        this.updateDragPosition(e.clientX, e.clientY);
    }

    handleMouseMove(e) {
        if (!this.state.draggingPiece) return;
        this.updateDragPosition(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
        if (!this.state.draggingPiece) return;
        
        // Find drop cell
        const cells = document.querySelectorAll('.cell');
        let targetCell = null;
        let minDist = Infinity;
        
        cells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) +
                Math.pow(e.clientY - centerY, 2)
            );
            
            if (dist < minDist) {
                minDist = dist;
                targetCell = cell;
            }
        });
        
        if (targetCell && this.state.selectedPiece) {
            const toX = parseInt(targetCell.dataset.x);
            const toY = parseInt(targetCell.dataset.y);
            this.movePiece(this.state.selectedPiece.x, this.state.selectedPiece.y, toX, toY);
        }
        
        this.cleanupDrag();
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        const piece = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.piece');
        if (!piece) return;
        
        const cell = piece.parentElement;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const pieceData = this.state.board[y][x];
        
        if (!pieceData || pieceData.color !== this.state.currentPlayer) return;
        
        this.state.draggingPiece = piece;
        this.state.selectedPiece = pieceData;
        
        const rect = piece.getBoundingClientRect();
        this.state.dragOffset = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        
        piece.classList.add('dragging');
        piece.style.position = 'fixed';
        piece.style.zIndex = '1000';
        
        this.updateDragPosition(touch.clientX, touch.clientY);
        e.preventDefault();
    }

    handleTouchMove(e) {
        if (!this.state.draggingPiece) return;
        const touch = e.touches[0];
        this.updateDragPosition(touch.clientX, touch.clientY);
        e.preventDefault();
    }

    handleTouchEnd(e) {
        if (!this.state.draggingPiece) return;
        
        const touch = e.changedTouches[0];
        const cells = document.querySelectorAll('.cell');
        let targetCell = null;
        let minDist = Infinity;
        
        cells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.sqrt(
                Math.pow(touch.clientX - centerX, 2) +
                Math.pow(touch.clientY - centerY, 2)
            );
            
            if (dist < minDist) {
                minDist = dist;
                targetCell = cell;
            }
        });
        
        if (targetCell && this.state.selectedPiece) {
            const toX = parseInt(targetCell.dataset.x);
            const toY = parseInt(targetCell.dataset.y);
            this.movePiece(this.state.selectedPiece.x, this.state.selectedPiece.y, toX, toY);
        }
        
        this.cleanupDrag();
        e.preventDefault();
    }

    updateDragPosition(x, y) {
        if (!this.state.draggingPiece) return;
        this.state.draggingPiece.style.left = (x - this.state.dragOffset.x) + 'px';
        this.state.draggingPiece.style.top = (y - this.state.dragOffset.y) + 'px';
    }

    cleanupDrag() {
        if (!this.state.draggingPiece) return;
        
        this.state.draggingPiece.classList.remove('dragging');
        this.state.draggingPiece.style.position = '';
        this.state.draggingPiece.style.left = '';
        this.state.draggingPiece.style.top = '';
        this.state.draggingPiece.style.zIndex = '';
        this.state.draggingPiece = null;
        this.state.dragOffset = { x: 0, y: 0 };
    }

    selectPiece(x, y) {
        const piece = this.state.board[y][x];
        if (!piece || piece.color !== this.state.currentPlayer) return;
        
        this.state.selectedPiece = piece;
        this.state.validMoves = this.calculateValidMoves(piece, x, y);
        this.renderBoard();
        
        // Play sound
        if (this.state.soundEnabled) {
            this.playSound('select');
        }
    }

    calculateValidMoves(piece, x, y) {
        const moves = [];
        const type = piece.type;
        
        switch(type) {
            case 'king':
                // Tướng đi 1 ô theo 4 hướng, trong cung
                const kingMoves = [
                    [x-1, y], [x+1, y],
                    [x, y-1], [x, y+1]
                ];
                kingMoves.forEach(([nx, ny]) => {
                    if (this.isInPalace(nx, ny, piece.color) && 
                        this.canMoveTo(nx, ny, piece.color)) {
                        moves.push({ x: nx, y: ny });
                    }
                });
                break;
                
            case 'advisor':
                // Sĩ đi chéo 1 ô, trong cung
                const advisorMoves = [
                    [x-1, y-1], [x+1, y-1],
                    [x-1, y+1], [x+1, y+1]
                ];
                advisorMoves.forEach(([nx, ny]) => {
                    if (this.isInPalace(nx, ny, piece.color) && 
                        this.canMoveTo(nx, ny, piece.color)) {
                        moves.push({ x: nx, y: ny });
                    }
                });
                break;
                
            case 'elephant':
                // Tượng đi chéo 2 ô, không qua sông
                const elephantMoves = [
                    [x-2, y-2], [x+2, y-2],
                    [x-2, y+2], [x+2, y+2]
                ];
                elephantMoves.forEach(([nx, ny]) => {
                    if (this.isValidPosition(nx, ny) && 
                        this.canMoveTo(nx, ny, piece.color) &&
                        !this.isBlockedForElephant(x, y, nx, ny) &&
                        ((piece.color === 'black' && ny <= 4) || 
                         (piece.color === 'red' && ny >= 5))) {
                        moves.push({ x: nx, y: ny });
                    }
                });
                break;
                
            case 'horse':
                // Mã đi ngày 2 dọc 1 hoặc ngang 1 dọc 2
                const horseMoves = [
                    [x-2, y-1], [x-2, y+1],
                    [x-1, y-2], [x-1, y+2],
                    [x+1, y-2], [x+1, y+2],
                    [x+2, y-1], [x+2, y+1]
                ];
                horseMoves.forEach(([nx, ny]) => {
                    if (this.isValidPosition(nx, ny) && 
                        this.canMoveTo(nx, ny, piece.color) &&
                        !this.isBlockedForHorse(x, y, nx, ny)) {
                        moves.push({ x: nx, y: ny });
                    }
                });
                break;
                
            case 'chariot':
                // Xe đi thẳng
                const chariotDirs = [[1,0], [-1,0], [0,1], [0,-1]];
                chariotDirs.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (this.isValidPosition(nx, ny)) {
                        if (this.canMoveTo(nx, ny, piece.color)) {
                            moves.push({ x: nx, y: ny });
                        }
                        
                        if (this.state.board[ny][nx]) break;
                        
                        nx += dx;
                        ny += dy;
                    }
                });
                break;
                
            case 'cannon':
                // Pháo giống xe nhưng ăn quân phải nhảy qua 1 quân
                const cannonDirs = [[1,0], [-1,0], [0,1], [0,-1]];
                cannonDirs.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    let hasPiece = false;
                    
                    while (this.isValidPosition(nx, ny)) {
                        if (!this.state.board[ny][nx]) {
                            if (!hasPiece) {
                                moves.push({ x: nx, y: ny });
                            }
                        } else {
                            if (!hasPiece) {
                                hasPiece = true;
                            } else {
                                if (this.state.board[ny][nx].color !== piece.color) {
                                    moves.push({ x: nx, y: ny });
                                }
                                break;
                            }
                        }
                        
                        nx += dx;
                        ny += dy;
                    }
                });
                break;
                
            case 'soldier':
                // Tốt/Binh
                if (piece.color === 'black') {
                    // Tiến về phía dưới
                    if (this.canMoveTo(x, y+1, piece.color)) {
                        moves.push({ x: x, y: y+1 });
                    }
                    
                    // Nếu đã qua sông (y > 4), có thể đi ngang
                    if (y > 4) {
                        if (this.canMoveTo(x-1, y, piece.color)) {
                            moves.push({ x: x-1, y: y });
                        }
                        if (this.canMoveTo(x+1, y, piece.color)) {
                            moves.push({ x: x+1, y: y });
                        }
                    }
                } else {
                    // Tiến về phía trên
                    if (this.canMoveTo(x, y-1, piece.color)) {
                        moves.push({ x: x, y: y-1 });
                    }
                    
                    // Nếu đã qua sông (y < 5), có thể đi ngang
                    if (y < 5) {
                        if (this.canMoveTo(x-1, y, piece.color)) {
                            moves.push({ x: x-1, y: y });
                        }
                        if (this.canMoveTo(x+1, y, piece.color)) {
                            moves.push({ x: x+1, y: y });
                        }
                    }
                }
                break;
        }
        
        return moves;
    }

    isValidPosition(x, y) {
        return x >= 0 && x < 9 && y >= 0 && y < 10;
    }

    isInPalace(x, y, color) {
        if (color === 'black') {
            return x >= 3 && x <= 5 && y >= 0 && y <= 2;
        } else {
            return x >= 3 && x <= 5 && y >= 7 && y <= 9;
        }
    }

    canMoveTo(x, y, color) {
        if (!this.isValidPosition(x, y)) return false;
        
        const target = this.state.board[y][x];
        if (!target) return true;
        return target.color !== color;
    }

    isBlockedForHorse(fromX, fromY, toX, toY) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        
        if (Math.abs(dx) === 2) {
            const blockX = fromX + (dx > 0 ? 1 : -1);
            return this.state.board[fromY][blockX] !== null;
        } else if (Math.abs(dy) === 2) {
            const blockY = fromY + (dy > 0 ? 1 : -1);
            return this.state.board[blockY][fromX] !== null;
        }
        return false;
    }

    isBlockedForElephant(fromX, fromY, toX, toY) {
        const blockX = fromX + (toX - fromX) / 2;
        const blockY = fromY + (toY - fromY) / 2;
        return this.state.board[blockY][blockX] !== null;
    }

    movePiece(fromX, fromY, toX, toY) {
        if (!this.state.selectedPiece) return false;
        
        // Check if move is valid
        const isValid = this.state.validMoves.some(
            move => move.x === toX && move.y === toY
        );
        
        if (!isValid) {
            this.state.selectedPiece = null;
            this.state.validMoves = [];
            this.renderBoard();
            return false;
        }
        
        const piece = this.state.board[fromY][fromX];
        const targetPiece = this.state.board[toY][toX];
        
        // Record move
        this.state.moveHistory.push({
            from: { x: fromX, y: fromY },
            to: { x: toX, y: toY },
            piece: piece.piece,
            captured: targetPiece,
            turn: this.state.currentPlayer
        });
        
        // Handle capture
        if (targetPiece) {
            this.state.capturedPieces[targetPiece.color].push(targetPiece);
            this.updateCapturedDisplay();
            this.playSound('capture');
        } else {
            this.playSound('move');
        }
        
        // Move piece
        this.state.board[toY][toX] = piece;
        this.state.board[fromY][fromX] = null;
        piece.x = toX;
        piece.y = toY;
        
        // Clear selection
        this.state.selectedPiece = null;
        this.state.validMoves = [];
        
        // Check for check
        this.checkForCheck();
        
        // Switch turns
        this.state.currentPlayer = this.state.currentPlayer === 'red' ? 'black' : 'red';
        
        // Update UI
        this.updateGameInfo();
        this.updateMoveHistory();
        this.renderBoard();
        
        // Check game end
        this.checkGameEnd();
        
        // AI move if needed
        if (this.state.gameMode === 'ai' && this.state.currentPlayer === 'black') {
            setTimeout(() => this.makeAIMove(), 500);
        }
        
        return true;
    }

    checkForCheck() {
        // Simplified check detection
        this.state.isCheck = false;
        // Implement full check logic here
    }

    checkGameEnd() {
        // Check for checkmate or stalemate
        // Implement full game end logic here
        return false;
    }

    makeAIMove() {
        // Simple AI - random move
        const allMoves = [];
        
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.state.board[y][x];
                if (piece && piece.color === 'black') {
                    const moves = this.calculateValidMoves(piece, x, y);
                    moves.forEach(move => {
                        allMoves.push({
                            from: { x, y },
                            to: move,
                            piece: piece
                        });
                    });
                }
            }
        }
        
        if (allMoves.length > 0) {
            const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            this.movePiece(randomMove.from.x, randomMove.from.y, randomMove.to.x, randomMove.to.y);
        }
    }

    updateGameInfo() {
        const currentTurn = document.getElementById('currentTurn');
        const gameStatus = document.getElementById('gameStatus');
        const gameModeDisplay = document.getElementById('gameModeDisplay');
        
        if (currentTurn) {
            currentTurn.textContent = this.state.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
            currentTurn.className = this.state.currentPlayer === 'red' ? 'red-turn' : 'black-turn';
        }
        
        if (gameStatus) {
            gameStatus.textContent = this.state.isCheck ? 'CHIẾU TƯỚNG!' : 'ĐANG CHƠI';
            gameStatus.style.color = this.state.isCheck ? '#e74c3c' : '#2ecc71';
        }
        
        if (gameModeDisplay) {
            const modeText = this.state.gameMode === 'ai' ? 'Đấu AI' : 
                           this.state.gameMode === 'local' ? '2 Người' : 'Online';
            gameModeDisplay.textContent = `${modeText} - ${this.state.gameMode === 'ai' ? 'Cấp ' + this.state.aiLevel : ''}`;
        }
    }

    updateMoveHistory() {
        const moveHistory = document.getElementById('moveHistory');
        if (!moveHistory) return;
        
        moveHistory.innerHTML = '';
        this.state.moveHistory.forEach((move, index) => {
            const moveItem = document.createElement('div');
            moveItem.className = 'move-item';
            moveItem.innerHTML = `
                <span class="move-number">${index + 1}.</span>
                <span class="move-notation">${move.piece} ${String.fromCharCode(97 + move.from.x)}${move.from.y+1}→${String.fromCharCode(97 + move.to.x)}${move.to.y+1}</span>
            `;
            moveHistory.appendChild(moveItem);
        });
        
        moveHistory.scrollTop = moveHistory.scrollHeight;
    }

    updateCapturedDisplay() {
        const capturedRed = document.getElementById('capturedRed');
        const capturedBlack = document.getElementById('capturedBlack');
        
        if (capturedRed) {
            capturedRed.innerHTML = '';
            this.state.capturedPieces.red.forEach(piece => {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'captured-piece red';
                pieceDiv.textContent = piece.piece;
                capturedRed.appendChild(pieceDiv);
            });
        }
        
        if (capturedBlack) {
            capturedBlack.innerHTML = '';
            this.state.capturedPieces.black.forEach(piece => {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'captured-piece black';
                pieceDiv.textContent = piece.piece;
                capturedBlack.appendChild(pieceDiv);
            });
        }
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.state.gameStatus === 'playing') {
                this.state.timeRemaining[this.state.currentPlayer]--;
                
                const redMinutes = Math.floor(this.state.timeRemaining.red / 60);
                const redSeconds = this.state.timeRemaining.red % 60;
                const blackMinutes = Math.floor(this.state.timeRemaining.black / 60);
                const blackSeconds = this.state.timeRemaining.black % 60;
                
                const redTime = document.getElementById('redTime');
                const blackTime = document.getElementById('blackTime');
                
                if (redTime) {
                    redTime.textContent = `${redMinutes.toString().padStart(2, '0')}:${redSeconds.toString().padStart(2, '0')}`;
                }
                
                if (blackTime) {
                    blackTime.textContent = `${blackMinutes.toString().padStart(2, '0')}:${blackSeconds.toString().padStart(2, '0')}`;
                }
                
                // Check time out
                if (this.state.timeRemaining.red <= 0 || this.state.timeRemaining.black <= 0) {
                    clearInterval(this.timerInterval);
                    const winner = this.state.timeRemaining.red <= 0 ? 'ĐEN' : 'ĐỎ';
                    this.showResult(`${winner} thắng do hết giờ!`, winner === 'ĐEN' ? 'lose' : 'win');
                }
            }
        }, 1000);
    }

    playSound(type) {
        if (!this.state.soundEnabled) return;
        
        // Simple sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            let frequency = 440;
            
            switch(type) {
                case 'move': frequency = 523.25; break;
                case 'capture': frequency = 659.25; break;
                case 'check': frequency = 783.99; break;
                case 'select': frequency = 392.00; break;
            }
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    showResult(message, type) {
        const resultModal = document.getElementById('resultModal');
        const resultMessage = document.getElementById('resultMessage');
        const resultIcon = document.getElementById('resultIcon');
        
        if (resultMessage) resultMessage.textContent = message;
        if (resultIcon) {
            resultIcon.className = 'result-icon';
            resultIcon.innerHTML = type === 'win' ? 
                '<i class="fas fa-trophy"></i>' : 
                '<i class="fas fa-times-circle"></i>';
        }
        
        if (resultModal) {
            resultModal.style.display = 'flex';
        }
        
        this.state.gameStatus = 'finished';
        clearInterval(this.timerInterval);
    }

    newGame() {
        if (confirm('Bắt đầu ván mới?')) {
            this.state = {
                board: [],
                currentPlayer: 'red',
                selectedPiece: null,
                gameMode: this.state.gameMode,
                aiLevel: this.state.aiLevel,
                gameStatus: 'playing',
                timeRemaining: { red: 600, black: 600 },
                moveHistory: [],
                validMoves: [],
                isCheck: false,
                capturedPieces: { red: [], black: [] },
                score: 0,
                soundEnabled: this.state.soundEnabled,
                musicEnabled: this.state.musicEnabled,
                gameStarted: true,
                draggingPiece: null,
                dragOffset: { x: 0, y: 0 }
            };
            
            this.createBoard();
            this.renderBoard();
            this.updateGameInfo();
            this.updateCapturedDisplay();
            this.updateMoveHistory();
            this.startTimer();
            
            toastr.success('Ván cờ mới đã bắt đầu!');
        }
    }

    undoMove() {
        if (this.state.moveHistory.length > 0) {
            const lastMove = this.state.moveHistory.pop();
            
            // Undo move
            const piece = this.state.board[lastMove.to.y][lastMove.to.x];
            this.state.board[lastMove.from.y][lastMove.from.x] = piece;
            this.state.board[lastMove.to.y][lastMove.to.x] = lastMove.captured;
            
            if (piece) {
                piece.x = lastMove.from.x;
                piece.y = lastMove.from.y;
            }
            
            // Restore captured piece
            if (lastMove.captured) {
                const index = this.state.capturedPieces[lastMove.captured.color]
                    .findIndex(p => p === lastMove.captured);
                if (index > -1) {
                    this.state.capturedPieces[lastMove.captured.color].splice(index, 1);
                    this.updateCapturedDisplay();
                }
            }
            
            // Restore turn
            this.state.currentPlayer = lastMove.turn;
            this.state.selectedPiece = null;
            this.state.validMoves = [];
            
            this.updateGameInfo();
            this.updateMoveHistory();
            this.renderBoard();
            
            toastr.info('Đã lùi 1 nước đi');
        } else {
            toastr.warning('Không có nước đi nào để lùi');
        }
    }

    saveGame() {
        localStorage.setItem('chess_saved_game', JSON.stringify(this.state));
        toastr.success('Đã lưu ván cờ thành công!');
    }

    loadGame() {
        const saved = localStorage.getItem('chess_saved_game');
        if (saved) {
            try {
                const gameData = JSON.parse(saved);
                this.state = gameData;
                this.renderBoard();
                this.updateGameInfo();
                this.updateCapturedDisplay();
                this.updateMoveHistory();
                this.startTimer();
                toastr.success('Đã tải ván cờ thành công!');
            } catch (e) {
                toastr.error('Lỗi khi tải ván cờ');
            }
        } else {
            toastr.warning('Không tìm thấy ván cờ đã lưu');
        }
    }

    loadGameSettings() {
        const settings = localStorage.getItem('chess_settings');
        if (settings) {
            try {
                const { soundEnabled, musicEnabled } = JSON.parse(settings);
                this.state.soundEnabled = soundEnabled;
                this.state.musicEnabled = musicEnabled;
            } catch (e) {
                console.log('Error loading settings');
            }
        }
    }

    saveGameSettings() {
        const settings = {
            soundEnabled: this.state.soundEnabled,
            musicEnabled: this.state.musicEnabled
        };
        localStorage.setItem('chess_settings', JSON.stringify(settings));
    }
}

// Create global instance
let chessGame;

// Initialize when DOM is loaded
// DISABLED: This initialization is handled by hoan-chinh-co-tuong.js to avoid conflicts
/*
document.addEventListener('DOMContentLoaded', () => {
    chessGame = new ChessGame();
    
    // Global functions for HTML onclick
    window.newGame = () => chessGame.newGame();
    window.undoMove = () => chessGame.undoMove();
    window.saveGame = () => chessGame.saveGame();
    window.offerDraw = () => {
        if (confirm('Gửi yêu cầu hòa cờ?')) {
            toastr.info('Đã gửi yêu cầu hòa cờ');
        }
    };
    window.surrender = () => {
        if (confirm('Bạn chắc chắn muốn đầu hàng?')) {
            chessGame.showResult('BẠN ĐÃ ĐẦU HÀNG!', 'lose');
        }
    };
    window.showHint = () => {
        toastr.info('Hãy kiểm soát trung tâm và phát triển quân!', 'Gợi ý');
    };
    window.analyzeGame = () => {
        toastr.info('Tính năng phân tích đang phát triển', 'Phân tích');
    };
    window.playAgain = () => {
        document.getElementById('resultModal').style.display = 'none';
        chessGame.newGame();
    };
    window.shareResult = () => {
        toastr.info('Tính năng chia sẻ đang phát triển', 'Chia sẻ');
    };
    
    // Game mode functions
    window.changeGameMode = (mode) => {
        chessGame.state.gameMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide AI level selector
        const aiSelector = document.getElementById('aiLevelSelector');
        const matchmakingPanel = document.getElementById('matchmakingPanel');
        
        if (aiSelector) {
            aiSelector.style.display = mode === 'ai' ? 'block' : 'none';
        }
        
        if (matchmakingPanel) {
            matchmakingPanel.style.display = mode === 'online' ? 'block' : 'none';
        }
        
        // Update player names
        const blackPlayerName = document.getElementById('blackPlayerName');
        if (blackPlayerName) {
            if (mode === 'ai') {
                blackPlayerName.textContent = `AI Cấp ${chessGame.state.aiLevel} (ĐEN)`;
            } else if (mode === 'local') {
                blackPlayerName.textContent = 'Người chơi 2 (ĐEN)';
            } else {
                blackPlayerName.textContent = 'Đối thủ (ĐEN)';
            }
        }
        
        toastr.info(`Đã chuyển sang chế độ: ${mode === 'ai' ? 'Đấu AI' : mode === 'local' ? '2 Người' : 'Online'}`);
    };
    
    window.setAILevel = (level) => {
        chessGame.state.aiLevel = level;
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === level) {
                btn.classList.add('active');
            }
        });
        
        const blackPlayerName = document.getElementById('blackPlayerName');
        if (blackPlayerName) {
            blackPlayerName.textContent = `AI Cấp ${level} (ĐEN)`;
        }
        
        toastr.info(`Đã đặt AI cấp độ: ${level}`);
    };
    
    // Sound controls
    window.toggleSound = () => {
        chessGame.state.soundEnabled = !chessGame.state.soundEnabled;
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            soundBtn.innerHTML = chessGame.state.soundEnabled ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
        }
        chessGame.saveGameSettings();
        toastr.info(chessGame.state.soundEnabled ? 'Đã bật âm thanh' : 'Đã tắt âm thanh');
    };
    
    window.toggleMusic = () => {
        chessGame.state.musicEnabled = !chessGame.state.musicEnabled;
        const musicBtn = document.getElementById('musicBtn');
        if (musicBtn) {
            musicBtn.innerHTML = chessGame.state.musicEnabled ? 
                '<i class="fas fa-music"></i>' : 
                '<i class="fas fa-music-slash"></i>';
        }
        chessGame.saveGameSettings();
        toastr.info(chessGame.state.musicEnabled ? 'Đã bật nhạc nền' : 'Đã tắt nhạc nền');
    };
}); // DISABLED: End of commented-out game.js initialization
*/

// ========== CHESS MOVEMENT SYSTEM ==========

class ChessMovementSystem {
    constructor(game) {
        this.game = game;
        this.selectedPiece = null;
        this.validMoves = [];
        this.isRedTurn = true;
        this.moveHistory = [];
        this.currentMoveIndex = -1;
        
        this.init();
    }
    
    init() {
        console.log("Chess Movement System initialized");
        this.createBoardCoordinates();
        this.setupEventListeners();
    }
    
    // Tạo tọa độ bàn cờ
    createBoardCoordinates() {
        const board = document.getElementById('chessBoard');
        if (!board) return;
        
        // Tọa độ ngang (1-9)
        for (let x = 0; x < 9; x++) {
            const coord = document.createElement('div');
            coord.className = 'board-coordinate x';
            coord.textContent = String.fromCharCode(65 + x); // A-I
            coord.style.left = `${(x * 11.11) + 5.55}%`;
            board.appendChild(coord);
        }
        
        // Tọa độ dọc (1-10)
        for (let y = 0; y < 10; y++) {
            const coord = document.createElement('div');
            coord.className = 'board-coordinate y';
            coord.textContent = (10 - y);
            coord.style.top = `${(y * 10) + 5}%`;
            board.appendChild(coord);
        }
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => this.handleBoardClick(e));
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Gắn sự kiện cho tất cả ô cờ
        const squares = document.querySelectorAll('.board-square');
        squares.forEach(square => {
            square.addEventListener('mouseenter', (e) => this.handleSquareHover(e));
            square.addEventListener('mouseleave', () => this.hideTooltip());
        });
    }
    
    // Xử lý click trên bàn cờ
    handleBoardClick(event) {
        const square = event.target.closest('.board-square');
        if (!square) {
            this.deselectPiece();
            return;
        }
        
        const x = parseInt(square.dataset.x);
        const y = parseInt(square.dataset.y);
        
        console.log(`Clicked square: (${x}, ${y})`);
        
        // Nếu có quân được chọn và ô này là nước đi hợp lệ
        if (this.selectedPiece) {
            const isValidMove = this.validMoves.some(move => move.x === x && move.y === y);
            
            if (isValidMove) {
                this.movePiece(x, y);
            } else {
                // Nếu click vào quân khác cùng màu
                const piece = this.getPieceAt(x, y);
                if (piece && this.isSameColor(piece, this.selectedPiece)) {
                    this.selectPiece(x, y);
                } else {
                    this.deselectPiece();
                }
            }
        } else {
            // Chọn quân mới
            this.selectPiece(x, y);
        }
    }
    
    // Chọn quân cờ
    selectPiece(x, y) {
        const piece = this.getPieceAt(x, y);
        if (!piece) return;
        
        // Kiểm tra lượt đi
        const pieceColor = piece.classList.contains('red-piece') ? 'red' : 'black';
        if ((this.isRedTurn && pieceColor !== 'red') || (!this.isRedTurn && pieceColor !== 'black')) {
            this.showInstruction("Không phải lượt của bạn!");
            return;
        }
        
        // Bỏ chọn quân cũ
        this.deselectPiece();
        
        // Chọn quân mới
        this.selectedPiece = { x, y, element: piece };
        piece.classList.add('selected');
        
        // Hiển thị nước đi hợp lệ
        this.showValidMoves(x, y, piece);
        
        // Hiển thị hướng dẫn
        this.showPieceInstruction(piece);
    }
    
    // Bỏ chọn quân
    deselectPiece() {
        if (this.selectedPiece) {
            this.selectedPiece.element.classList.remove('selected');
            this.selectedPiece = null;
        }
        
        // Xóa highlight nước đi
        this.clearValidMoves();
        
        // Ẩn instruction
        this.hideInstruction();
    }
    
    // Hiển thị nước đi hợp lệ
    showValidMoves(x, y, piece) {
        this.validMoves = this.calculateValidMoves(x, y, piece);
        
        this.validMoves.forEach(move => {
            const square = document.querySelector(`.board-square[data-x="${move.x}"][data-y="${move.y}"]`);
            if (square) {
                square.classList.add('valid-move');
                if (move.isCapture) {
                    square.classList.add('capture');
                }
            }
        });
    }
    
    // Xóa highlight nước đi
    clearValidMoves() {
        document.querySelectorAll('.valid-move').forEach(square => {
            square.classList.remove('valid-move', 'capture', 'attack');
        });
        this.validMoves = [];
    }
    
    // Tính toán nước đi hợp lệ (đơn giản hóa)
    calculateValidMoves(x, y, piece) {
        const moves = [];
        const pieceType = this.getPieceType(piece);
        
        // Di chuyển cơ bản cho demo
        switch(pieceType) {
            case '帥': // Tướng đỏ
            case '將': // Tướng đen
                moves.push({x: x+1, y, isCapture: false});
                moves.push({x: x-1, y, isCapture: false});
                moves.push({x, y: y+1, isCapture: false});
                moves.push({x, y: y-1, isCapture: false});
                break;
                
            case '仕': // Sĩ đỏ
            case '士': // Sĩ đen
                moves.push({x: x+1, y: y+1, isCapture: false});
                moves.push({x: x-1, y: y+1, isCapture: false});
                moves.push({x: x+1, y: y-1, isCapture: false});
                moves.push({x: x-1, y: y-1, isCapture: false});
                break;
                
            case '相': // Tượng đỏ
            case '象': // Tượng đen
                moves.push({x: x+2, y: y+2, isCapture: false});
                moves.push({x: x-2, y: y+2, isCapture: false});
                moves.push({x: x+2, y: y-2, isCapture: false});
                moves.push({x: x-2, y: y-2, isCapture: false});
                break;
                
            case '馬': // Mã đỏ
            case '傌': // Mã đen
                moves.push({x: x+2, y: y+1, isCapture: false});
                moves.push({x: x+2, y: y-1, isCapture: false});
                moves.push({x: x-2, y: y+1, isCapture: false});
                moves.push({x: x-2, y: y-1, isCapture: false});
                moves.push({x: x+1, y: y+2, isCapture: false});
                moves.push({x: x+1, y: y-2, isCapture: false});
                moves.push({x: x-1, y: y+2, isCapture: false});
                moves.push({x: x-1, y: y-2, isCapture: false});
                break;
                
            case '車': // Xe đỏ
            case '俥': // Xe đen
                // Đi thẳng
                for (let i = x+1; i < 9; i++) moves.push({x: i, y, isCapture: false});
                for (let i = x-1; i >= 0; i--) moves.push({x: i, y, isCapture: false});
                for (let i = y+1; i < 10; i++) moves.push({x, y: i, isCapture: false});
                for (let i = y-1; i >= 0; i--) moves.push({x, y: i, isCapture: false});
                break;
                
            case '炮': // Pháo đỏ
            case '砲': // Pháo đen
                moves.push({x: x+1, y, isCapture: false});
                moves.push({x: x-1, y, isCapture: false});
                moves.push({x, y: y+1, isCapture: false});
                moves.push({x, y: y-1, isCapture: false});
                break;
                
            case '兵': // Binh đỏ
            case '卒': // Tốt đen
                if (pieceType === '兵') {
                    moves.push({x, y: y-1, isCapture: false}); // Đỏ đi lên
                } else {
                    moves.push({x, y: y+1, isCapture: false}); // Đen đi xuống
                }
                moves.push({x: x+1, y, isCapture: false});
                moves.push({x: x-1, y, isCapture: false});
                break;
        }
        
        // Lọc nước đi ngoài bàn cờ
        return moves.filter(move => 
            move.x >= 0 && move.x < 9 && 
            move.y >= 0 && move.y < 10
        );
    }
    
    // Di chuyển quân cờ
    movePiece(toX, toY) {
        if (!this.selectedPiece) return;
        
        const fromX = this.selectedPiece.x;
        const fromY = this.selectedPiece.y;
        const piece = this.selectedPiece.element;
        
        console.log(`Moving piece from (${fromX}, ${fromY}) to (${toX}, ${toY})`);
        
        // Kiểm tra nếu có quân ở đích đến
        const targetPiece = this.getPieceAt(toX, toY);
        if (targetPiece) {
            // Xử lý ăn quân
            this.capturePiece(toX, toY, targetPiece);
        }
        
        // Di chuyển quân
        this.animatePieceMovement(piece, fromX, fromY, toX, toY);
        
        // Cập nhật trạng thái game
        this.updateGameState(fromX, fromY, toX, toY);
        
        // Đổi lượt
        this.switchTurn();
        
        // Bỏ chọn quân
        this.deselectPiece();
        
        // Hiển thị hướng dẫn lượt tiếp theo
        this.showTurnInstruction();
    }
    
    // Animation di chuyển quân
    animatePieceMovement(piece, fromX, fromY, toX, toY) {
        piece.classList.add('moving');
        
        const fromSquare = document.querySelector(`.board-square[data-x="${fromX}"][data-y="${fromY}"]`);
        const toSquare = document.querySelector(`.board-square[data-x="${toX}"][data-y="${toY}"]`);
        
        if (fromSquare && toSquare) {
            // Di chuyển DOM element
            toSquare.appendChild(piece);
            
            // Hiệu ứng
            setTimeout(() => {
                piece.classList.remove('moving');
            }, 300);
        }
    }
    
    // Ăn quân
    capturePiece(x, y, piece) {
        const capturedContainer = piece.classList.contains('red-piece') 
            ? document.getElementById('capturedRed') 
            : document.getElementById('capturedBlack');
        
        if (capturedContainer) {
            const capturedPiece = piece.cloneNode(true);
            capturedPiece.style.fontSize = '20px';
            capturedPiece.style.margin = '2px';
            capturedContainer.appendChild(capturedPiece);
        }
        
        piece.remove();
        console.log(`Piece captured at (${x}, ${y})`);
    }
    
    // Cập nhật trạng thái game
    updateGameState(fromX, fromY, toX, toY) {
        const moveNotation = this.getMoveNotation(fromX, fromY, toX, toY);
        this.moveHistory.push({
            from: {x: fromX, y: fromY},
            to: {x: toX, y: toY},
            notation: moveNotation,
            turn: this.isRedTurn ? 'red' : 'black'
        });
        
        this.currentMoveIndex = this.moveHistory.length - 1;
        this.updateMoveHistoryDisplay();
    }
    
    // Đổi lượt
    switchTurn() {
        this.isRedTurn = !this.isRedTurn;
        
        // Cập nhật hiển thị lượt
        const turnElement = document.getElementById('currentTurn');
        if (turnElement) {
            turnElement.textContent = this.isRedTurn ? 'ĐỎ' : 'ĐEN';
            turnElement.className = this.isRedTurn ? 'red-turn' : 'black-turn';
        }
        
        // Cập nhật game status
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = this.isRedTurn ? 'ĐỎ ĐANG ĐI' : 'ĐEN ĐANG ĐI';
        }
    }
    
    // Hiển thị hướng dẫn
    showPieceInstruction(piece) {
        const pieceType = this.getPieceType(piece);
        const pieceName = this.getPieceName(pieceType);
        const rules = this.getPieceRules(pieceType);
        
        const instructionText = `
            <strong>${pieceName}</strong><br>
            ${rules}
        `;
        
        this.showInstruction(instructionText);
    }
    
    showTurnInstruction() {
        const player = this.isRedTurn ? 'ĐỎ' : 'ĐEN';
        this.showInstruction(`Lượt của ${player}. Chọn quân để di chuyển.`);
    }
    
    showInstruction(text) {
        const panel = document.getElementById('moveInstructionPanel');
        const content = document.getElementById('instructionText');
        
        if (panel && content) {
            content.innerHTML = text;
            panel.classList.add('show');
            
            // Tự động ẩn sau 5 giây
            setTimeout(() => {
                panel.classList.remove('show');
            }, 5000);
        }
    }
    
    hideInstruction() {
        const panel = document.getElementById('moveInstructionPanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }
    
    // Helper functions
    getPieceAt(x, y) {
        const square = document.querySelector(`.board-square[data-x="${x}"][data-y="${y}"]`);
        if (!square) return null;
        
        return square.querySelector('.piece');
    }
    
    getPieceType(piece) {
        return piece.textContent.trim();
    }
    
    getPieceName(pieceType) {
        const names = {
            '帥': 'Tướng Đỏ', '將': 'Tướng Đen',
            '仕': 'Sĩ Đỏ', '士': 'Sĩ Đen',
            '相': 'Tượng Đỏ', '象': 'Tượng Đen',
            '馬': 'Mã Đỏ', '傌': 'Mã Đen',
            '車': 'Xe Đỏ', '俥': 'Xe Đen',
            '炮': 'Pháo Đỏ', '砲': 'Pháo Đen',
            '兵': 'Binh Đỏ', '卒': 'Tốt Đen'
        };
        return names[pieceType] || pieceType;
    }
    
    getPieceRules(pieceType) {
        const rules = {
            '帥': 'Đi 1 ô theo 4 hướng ngang/dọc, trong cung',
            '將': 'Đi 1 ô theo 4 hướng ngang/dọc, trong cung',
            '仕': 'Đi 1 ô chéo, trong cung',
            '士': 'Đi 1 ô chéo, trong cung',
            '相': 'Đi 2 ô chéo, không qua sông',
            '象': 'Đi 2 ô chéo, không qua sông',
            '馬': 'Đi ngang 2/dọc 1 hoặc dọc 2/ngang 1',
            '傌': 'Đi ngang 2/dọc 1 hoặc dọc 2/ngang 1',
            '車': 'Đi thẳng bao xa cũng được',
            '俥': 'Đi thẳng bao xa cũng được',
            '炮': 'Đi thẳng, ăn quân phải có quân đệm',
            '砲': 'Đi thẳng, ăn quân phải có quân đệm',
            '兵': 'Đi 1 ô thẳng, qua sông được đi ngang',
            '卒': 'Đi 1 ô thẳng, qua sông được đi ngang'
        };
        return rules[pieceType] || 'Chưa có thông tin';
    }
    
    isSameColor(piece1, piece2) {
        return piece1.classList.contains('red-piece') === piece2.classList.contains('red-piece');
    }
    
    getMoveNotation(fromX, fromY, toX, toY) {
        const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const fromCol = columns[fromX];
        const toCol = columns[toX];
        const fromRow = 10 - fromY;
        const toRow = 10 - toY;
        
        return `${fromCol}${fromRow} → ${toCol}${toRow}`;
    }
    
    updateMoveHistoryDisplay() {
        const container = document.getElementById('moveHistory');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.moveHistory.forEach((move, index) => {
            const item = document.createElement('div');
            item.className = `move-history-item ${index === this.currentMoveIndex ? 'current' : ''}`;
            item.innerHTML = `
                <span class="move-number">${index + 1}.</span>
                <span class="move-notation">${move.notation}</span>
                <span class="move-turn">(${move.turn === 'red' ? 'Đỏ' : 'Đen'})</span>
            `;
            
            item.addEventListener('click', () => this.reviewMove(index));
            container.appendChild(item);
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
    
    reviewMove(index) {
        // Để xem lại nước đi (có thể implement sau)
        console.log(`Reviewing move ${index + 1}:`, this.moveHistory[index]);
    }
    
    handleSquareHover(event) {
        const square = event.target.closest('.board-square');
        if (!square) return;
        
        const x = parseInt(square.dataset.x);
        const y = parseInt(square.dataset.y);
        const piece = this.getPieceAt(x, y);
        
        if (piece) {
            this.showPieceTooltip(piece, event.clientX, event.clientY);
        }
    }
    
    showPieceTooltip(piece, x, y) {
        const tooltip = document.getElementById('pieceTooltip');
        if (!tooltip) return;
        
        const pieceType = this.getPieceType(piece);
        const pieceName = this.getPieceName(pieceType);
        
        tooltip.textContent = pieceName;
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y - 10}px`;
        tooltip.style.display = 'block';
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('pieceTooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    handleKeyPress(event) {
        switch(event.key) {
            case 'Escape':
                this.deselectPiece();
                break;
            case 'h':
            case 'H':
                this.showHint();
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.undoMove();
                }
                break;
        }
    }
    
    // Hiển thị gợi ý
    showHint() {
        if (!this.isRedTurn) return;
        
        // Tìm tất cả quân đỏ
        const redPieces = document.querySelectorAll('.red-piece');
        if (redPieces.length === 0) return;
        
        // Chọn ngẫu nhiên một quân
        const randomPiece = redPieces[Math.floor(Math.random() * redPieces.length)];
        const square = randomPiece.closest('.board-square');
        const x = parseInt(square.dataset.x);
        const y = parseInt(square.dataset.y);
        
        // Highlight quân được gợi ý
        this.selectPiece(x, y);
        
        this.showInstruction(`Gợi ý: Hãy di chuyển ${this.getPieceName(this.getPieceType(randomPiece))}`);
    }
    
    // Undo move
    undoMove() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        this.currentMoveIndex--;
        
        // Khôi phục trạng thái
        // (Cần implement đầy đủ)
        console.log('Undo move:', lastMove);
        
        this.updateMoveHistoryDisplay();
        this.switchTurn();
    }
}

// Khởi tạo hệ thống khi trang load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Chess Movement System...");
    
    // Đợi board được tạo
    setTimeout(() => {
        if (typeof chessGame !== 'undefined') {
            window.chessMovement = new ChessMovementSystem(chessGame);
            console.log("Chess Movement System ready!");
        } else {
            console.error("Chess game not initialized");
        }
    }, 1000);
});

// Export các hàm global
window.showHint = function() {
    if (window.chessMovement) {
        window.chessMovement.showHint();
    }
};

window.undoMove = function() {
    if (window.chessMovement) {
        window.chessMovement.undoMove();
    }
};