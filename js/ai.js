// ========== ADVANCED AI SYSTEM ==========
class AdvancedChessAI {
    constructor(game = null) {
        this.game = game;
        this.level = 3;
        this.maxDepth = 3;
        this.evaluationCache = new Map();
        this.openingBook = this.createOpeningBook();
        this.transpositionTable = new Map();
    }

    setGame(game) {
        this.game = game;
    }

    setLevel(level) {
        this.level = level;
        this.maxDepth = level; // Level 1-5 tương ứng depth 1-5
        console.log('AI set to level ' + level + ', search depth: ' + this.maxDepth);
    }

    createOpeningBook() {
        return {
            'standard': [
                { from: [7, 9], to: [7, 7], piece: '馬' }, // Mã phải
                { from: [1, 9], to: [1, 7], piece: '馬' }, // Mã trái
                { from: [1, 7], to: [1, 6], piece: '炮' }, // Pháo trái
                { from: [7, 7], to: [7, 6], piece: '炮' }, // Pháo phải
            ]
        };
    }

    getOpeningMove(board) {
        const moves = this.openingBook.standard;
        for (const move of moves) {
            const [fx, fy] = move.from;
            const [tx, ty] = move.to;
            const piece = board[fy][fx];
            
            if (piece && piece.piece === move.piece) {
                const validMoves = this.game.calculateValidMoves(piece, fx, fy);
                if (validMoves.some(m => m.x === tx && m.y === ty)) {
                    return { from: { x: fx, y: fy }, to: { x: tx, y: ty }, piece: piece };
                }
            }
        }
        return null;
    }

    getBestMove() {
        console.time('AI Thinking');
        
        if (!this.game || !this.game.state) {
            console.timeEnd('AI Thinking');
            console.warn('Game not initialized for AI');
            return null;
        }
        
        // Try opening book first
        if (this.game.state.moveHistory.length < 4) {
            const openingMove = this.getOpeningMove(this.game.state.board);
            if (openingMove) {
                console.timeEnd('AI Thinking');
                return openingMove;
            }
        }

        const allMoves = this.getAllPossibleMoves('black');
        
        if (allMoves.length === 0) {
            console.timeEnd('AI Thinking');
            return null;
        }

        let bestMove = null;
        let bestScore = -Infinity;
        const alpha = -Infinity;
        const beta = Infinity;

        // Sort moves for better pruning
        const sortedMoves = this.orderMoves(allMoves);

        // Iterative deepening
        for (let depth = 1; depth <= this.maxDepth; depth++) {
            let currentBest = null;
            let currentScore = -Infinity;

            for (const move of sortedMoves) {
                // Make move
                const captured = this.simulateMove(move);
                
                // Evaluate
                const score = -this.alphaBeta(depth - 1, -beta, -alpha, false);
                
                // Undo move
                this.undoMove(move, captured);
                
                if (score > currentScore) {
                    currentScore = score;
                    currentBest = move;
                }
            }

            if (currentBest) {
                bestMove = currentBest;
                bestScore = currentScore;
            }
        }

        console.timeEnd('AI Thinking');
        console.log('AI chose move with score: ' + bestScore);
        
        return bestMove;
    }

    alphaBeta(depth, alpha, beta, isMaximizing) {
        const hash = this.getBoardHash();
        
        // Check transposition table
        if (this.transpositionTable.has(hash)) {
            const entry = this.transpositionTable.get(hash);
            if (entry.depth >= depth) {
                return entry.score;
            }
        }

        if (depth === 0) {
            return this.evaluateBoard();
        }

        const color = isMaximizing ? 'black' : 'red';
        const moves = this.getAllPossibleMoves(color);

        if (moves.length === 0) {
            // Checkmate or stalemate
            if (this.isKingInCheck(color)) {
                return isMaximizing ? -10000 + depth : 10000 - depth; // Prefer longer checkmate
            }
            return 0; // Stalemate
        }

        // Sort moves for better pruning
        const sortedMoves = this.orderMoves(moves);

        if (isMaximizing) {
            let maxEval = -Infinity;
            
            for (const move of sortedMoves) {
                const captured = this.simulateMove(move);
                const evalScore = this.alphaBeta(depth - 1, alpha, beta, false);
                this.undoMove(move, captured);
                
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                
                if (beta <= alpha) {
                    break; // Beta cut-off
                }
            }
            
            // Store in transposition table
            this.transpositionTable.set(hash, { depth, score: maxEval, flag: 'EXACT' });
            return maxEval;
        } else {
            let minEval = Infinity;
            
            for (const move of sortedMoves) {
                const captured = this.simulateMove(move);
                const evalScore = this.alphaBeta(depth - 1, alpha, beta, true);
                this.undoMove(move, captured);
                
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                
                if (beta <= alpha) {
                    break; // Alpha cut-off
                }
            }
            
            // Store in transposition table
            this.transpositionTable.set(hash, { depth, score: minEval, flag: 'EXACT' });
            return minEval;
        }
    }

    getAllPossibleMoves(color) {
        const moves = [];
        
        if (!this.game || !this.game.state || !this.game.state.board) {
            return moves;
        }
        
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.game.state.board[y][x];
                if (piece && piece.color === color) {
                    const pieceMoves = this.game.calculateValidMoves(piece, x, y) || [];
                    pieceMoves.forEach(move => {
                        moves.push({
                            from: { x, y },
                            to: move,
                            piece: piece
                        });
                    });
                }
            }
        }
        
        return moves;
    }

    orderMoves(moves) {
        return moves.sort((a, b) => {
            const scoreA = this.quickEvaluateMove(a);
            const scoreB = this.quickEvaluateMove(b);
            return scoreB - scoreA; // Descending order
        });
    }

    quickEvaluateMove(move) {
        let score = 0;
        const target = this.game.state.board[move.to.y][move.to.x];
        
        // Capture moves first
        if (target) {
            const attackerValue = this.getPieceValue(move.piece.type);
            const defenderValue = this.getPieceValue(target.type);
            score += defenderValue * 10 - attackerValue;
        }
        
        // Check moves
        if (this.wouldCauseCheck(move)) {
            score += 50;
        }
        
        // Center control
        if (move.to.x >= 3 && move.to.x <= 5 && move.to.y >= 4 && move.to.y <= 5) {
            score += 10;
        }
        
        // Development
        if (move.piece.type !== 'soldier' && move.to.y > 2) {
            score += 5;
        }
        
        return score;
    }

    simulateMove(move) {
        const captured = this.game.state.board[move.to.y][move.to.x];
        
        // Move piece
        this.game.state.board[move.to.y][move.to.x] = move.piece;
        this.game.state.board[move.from.y][move.from.x] = null;
        
        // Update piece position
        move.piece.x = move.to.x;
        move.piece.y = move.to.y;
        
        return captured;
    }

    undoMove(move, captured) {
        // Restore piece to original position
        this.game.state.board[move.from.y][move.from.x] = move.piece;
        this.game.state.board[move.to.y][move.to.x] = captured;
        
        // Update piece position
        move.piece.x = move.from.x;
        move.piece.y = move.from.y;
    }

    evaluateBoard() {
        let score = 0;
        
        if (!this.game || !this.game.state || !this.game.state.board) {
            return score;
        }
        
        // Material score
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.game.state.board[y][x];
                if (piece) {
                    const value = this.getPieceValue(piece.type);
                    const positionBonus = this.getPositionBonus(piece, x, y);
                    const mobility = this.getMobilityScore(piece, x, y);
                    
                    const totalValue = value + positionBonus + mobility;
                    
                    if (piece.color === 'black') {
                        score += totalValue;
                    } else {
                        score -= totalValue;
                    }
                }
            }
        }
        
        // King safety
        score += this.evaluateKingSafety('black') - this.evaluateKingSafety('red');
        
        // Pawn structure
        score += this.evaluatePawnStructure('black') - this.evaluatePawnStructure('red');
        
        // Center control
        score += this.evaluateCenterControl('black') - this.evaluateCenterControl('red');
        
        return score;
    }

    getPieceValue(type) {
        const values = {
            'king': 1000,
            'advisor': 20,
            'elephant': 20,
            'horse': 45,
            'chariot': 90,
            'cannon': 45,
            'soldier': 10
        };
        return values[type] || 0;
    }

    getPositionBonus(piece, x, y) {
        // Different position tables for different pieces
        if (piece.type === 'horse') {
            // Horses better in center
            const horseTable = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 5, 5, 5, 0, 0, 0],
                [0, 0, 5, 10, 10, 10, 5, 0, 0],
                [0, 5, 10, 15, 15, 15, 10, 5, 0],
                [0, 5, 10, 15, 15, 15, 10, 5, 0],
                [0, 5, 10, 15, 15, 15, 10, 5, 0],
                [0, 0, 5, 10, 10, 10, 5, 0, 0],
                [0, 0, 0, 5, 5, 5, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            return horseTable[y][x] || 0;
        }
        
        if (piece.type === 'cannon') {
            // Cannons better in own territory early, cross river later
            const cannonTable = [
                [0, 0, 0, 5, 5, 5, 0, 0, 0],
                [0, 0, 5, 10, 10, 10, 5, 0, 0],
                [0, 5, 10, 15, 15, 15, 10, 5, 0],
                [5, 10, 15, 20, 20, 20, 15, 10, 5],
                [5, 10, 15, 20, 20, 20, 15, 10, 5],
                [5, 10, 15, 20, 20, 20, 15, 10, 5],
                [0, 5, 10, 15, 15, 15, 10, 5, 0],
                [0, 0, 5, 10, 10, 10, 5, 0, 0],
                [0, 0, 0, 5, 5, 5, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            return cannonTable[y][x] || 0;
        }
        
        if (piece.type === 'soldier') {
            // Pawns gain value as they advance
            if (piece.color === 'black') {
                return (y - 3) * 2; // Black pawns moving down
            } else {
                return (6 - y) * 2; // Red pawns moving up
            }
        }
        
        return 0;
    }

    getMobilityScore(piece, x, y) {
        const moves = this.game.calculateValidMoves(piece, x, y);
        return moves.length * 0.5;
    }

    evaluateKingSafety(color) {
        let safety = 0;
        
        // Find king
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.game.state.board[y][x];
                if (piece && piece.type === 'king' && piece.color === color) {
                    // Count defenders around king
                    const defenders = this.countDefenders(x, y, color);
                    safety += defenders * 5;
                    
                    // Penalty if king is exposed
                    if (defenders < 2) {
                        safety -= 10;
                    }
                    break;
                }
            }
        }
        
        return safety;
    }

    countDefenders(x, y, color) {
        let count = 0;
        const directions = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1], [1,-1], [-1,1], [1,1]];
        
        directions.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                const piece = this.game.state.board[ny][nx];
                if (piece && piece.color === color) {
                    count++;
                }
            }
        });
        
        return count;
    }

    evaluatePawnStructure(color) {
        let score = 0;
        const pawns = [];
        
        // Collect pawn positions
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.game.state.board[y][x];
                if (piece && piece.type === 'soldier' && piece.color === color) {
                    pawns.push({ x, y });
                }
            }
        }
        
        // Bonus for connected pawns
        pawns.forEach(pawn => {
            // Check for pawns on adjacent files
            if (pawns.some(p => Math.abs(p.x - pawn.x) === 1 && p.y === pawn.y)) {
                score += 5;
            }
            
            // Bonus for passed pawns
            if (this.isPassedPawn(pawn, color)) {
                score += 10;
            }
        });
        
        return score;
    }

    isPassedPawn(pawn, color) {
        // Check if pawn has no opposing pawns in front
        if (color === 'black') {
            for (let y = pawn.y + 1; y < 10; y++) {
                const piece = this.game.state.board[y][pawn.x];
                if (piece && piece.type === 'soldier' && piece.color === 'red') {
                    return false;
                }
            }
        } else {
            for (let y = pawn.y - 1; y >= 0; y--) {
                const piece = this.game.state.board[y][pawn.x];
                if (piece && piece.type === 'soldier' && piece.color === 'black') {
                    return false;
                }
            }
        }
        return true;
    }

    evaluateCenterControl(color) {
        let control = 0;
        const centerSquares = [[3,4], [4,4], [5,4], [3,5], [4,5], [5,5]];
        
        centerSquares.forEach(([x, y]) => {
            // Check attacks to center squares
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (nx >= 0 && nx < 9 && ny >= 0 && ny < 10) {
                        const piece = this.game.state.board[ny][nx];
                        if (piece && piece.color === color) {
                            // Add control based on piece value
                            control += this.getPieceValue(piece.type) * 0.1;
                        }
                    }
                }
            }
        });
        
        return control;
    }

    wouldCauseCheck(move) {
        const captured = this.simulateMove(move);
        const inCheck = this.isKingInCheck('red');
        this.undoMove(move, captured);
        return inCheck;
    }

    isKingInCheck(color) {
        // Find king position
        let kingX, kingY;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.game.state.board[y][x];
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingX = x;
                    kingY = y;
                    break;
                }
            }
        }
        
        if (kingX === undefined) return false;
        
        // Check if any opponent piece attacks the king
        const opponentColor = color === 'red' ? 'black' : 'red';
        
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.game.state.board[y][x];
                if (piece && piece.color === opponentColor) {
                    const moves = this.game.calculateValidMoves(piece, x, y);
                    if (moves.some(m => m.x === kingX && m.y === kingY)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    getBoardHash() {
        // Simple board hashing for transposition table
        let hash = '';
        
        if (!this.game || !this.game.state || !this.game.state.board) {
            return hash;
        }
        
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.game.state.board[y][x];
                if (piece) {
                    // Use piece.type or piece.piece, whichever exists
                    const pieceChar = piece.type || piece.piece || '?';
                    const colorChar = (piece.color && piece.color[0]) || '?';
                    hash += pieceChar + colorChar + x + y;
                } else {
                    hash += '--';
                }
            }
        }
        return hash;
    }
}