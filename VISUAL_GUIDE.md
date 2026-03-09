# 🎮 Game Control Buttons - Visual Guide

## Button Locations in HTML

```html
<!-- Game Controls Row -->
<div class="game-controls">
    <!-- BUTTON 1: NEW GAME -->
    <button class="btn btn-primary" onclick="newGame()">
        <i class="fas fa-plus-circle"></i> Ván mới
    </button>
    
    <!-- BUTTON 2: BACK/UNDO -->
    <button class="btn btn-secondary" onclick="undoMove()">
        <i class="fas fa-undo"></i> Lùi nước
    </button>
    
    <!-- OTHER BUTTONS (EXISTING) -->
    <button class="btn btn-info" onclick="showHint()">
        <i class="fas fa-lightbulb"></i> Gợi ý
    </button>
    
    <button class="btn btn-warning" onclick="offerDraw()">
        <i class="fas fa-handshake"></i> Xin hòa
    </button>
    
    <!-- BUTTON 3: SURRENDER -->
    <button class="btn btn-danger" onclick="surrender()">
        <i class="fas fa-flag"></i> Đầu hàng
    </button>
    
    <button class="btn btn-success" onclick="saveGame()">
        <i class="fas fa-save"></i> Lưu ván
    </button>
</div>
```

---

## Call Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   USER CLICKS BUTTON                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
         ┌─────────────────────────────────────┐
         │   HTML onclick Handler Triggered    │
         │  (onclick="newGame()" etc.)         │
         └─────────────────────────────────────┘
                         ↓
     ┌───────────────────────────────────────────────────┐
     │            js/main.js Function Called             │
     │  • newGame()    • undoMove()    • surrender()     │
     └───────────────────────────────────────────────────┘
                         ↓
     ┌───────────────────────────────────────────────────┐
     │         js/hoan-chinh-co-tuong.js                 │
     │         Global window Function Called             │
     │  • window.newGame()                               │
     │  • window.undoMove()                              │
     │  • window.surrender()                             │
     └───────────────────────────────────────────────────┘
                         ↓
     ┌───────────────────────────────────────────────────┐
     │    CoTuongHoanChinh Method Called                 │
     │  • resetGame()         (line 974)                 │
     │  • hoanTacNuocDi()     (line 1011)                │
     │  • dauHang()           (line 1062)                │
     └───────────────────────────────────────────────────┘
                         ↓
     ┌───────────────────────────────────────────────────┐
     │          Game State Updated                       │
     │  • Board recreated or modified                    │
     │  • Pieces repositioned                            │
     │  • Move history updated                           │
     │  • UI refreshed                                   │
     └───────────────────────────────────────────────────┘
                         ↓
     ┌───────────────────────────────────────────────────┐
     │       User Notification Displayed                 │
     │  • Toastr notification shown                      │
     │  • Console message logged                         │
     │  • Game status updated                            │
     └───────────────────────────────────────────────────┘
```

---

## Button 1: NEW GAME (Ván mới)

### Visual Flow
```
┌──────────────────┐
│  Click "Ván mới" │
└────────┬─────────┘
         ↓
    ┌─────────────┐
    │ Confirmation? └─→ (No need)
    └─────────────┘
         ↓
    ┌────────────────────────┐
    │ Reset Game State       │
    │ • Clear all moves      │
    │ • Clear captures       │
    │ • Reset board          │
    └────────────────────────┘
         ↓
    ┌────────────────────────┐
    │ Recreate Board         │
    │ • Create 10x9 grid     │
    │ • Place 32 pieces      │
    │ • Set RED as current   │
    └────────────────────────┘
         ↓
    ┌────────────────────────┐
    │ Display Result         │
    │ 🔄 Bắt đầu ván mới!    │
    │    Đỏ đi trước.        │
    └────────────────────────┘
```

### State Changes
```
BEFORE                      AFTER
─────────────────────────────────────────
Red: 2 pieces in play   →   Red: 16 pieces (starting)
Black: 3 pieces         →   Black: 16 pieces (starting)
Move history: 5 moves   →   Move history: Empty
Captured (Red): 1       →   Captured (Red): Empty
Captured (Black): 2     →   Captured (Black): Empty
Current player: Black   →   Current player: Red
```

---

## Button 2: BACK/UNDO (Lùi nước)

### Visual Flow
```
┌──────────────────┐
│ Click "Lùi nước" │
└────────┬─────────┘
         ↓
    ┌─────────────────────┐
    │ Any moves to undo?  │
    └──┬─────────────┬────┘
       │             │
      NO             YES
       │             │
       ↓             ↓
    ┌─────┐     ┌─────────────┐
    │ Warn│     │ Reset board │
    └─────┘     └──────┬──────┘
                       ↓
                ┌─────────────┐
                │ Recreate    │
                │ board state │
                │ (no last    │
                │  move)      │
                └──────┬──────┘
                       ↓
                ┌─────────────┐
                │ Update UI   │
                │ & notify    │
                └─────────────┘
```

### Example Scenario
```
Move Sequence:       1. Red Pawn A6→A5
                     2. Black Pawn I4→I5
                     3. Red Pawn A5→A4
                     
User clicks "Lùi nước"
                        ↓
Undo removes:        Move 3 (Red Pawn A5→A4)
                        ↓
Board state becomes: 1. Red Pawn A6→A5
                     2. Black Pawn I4→I5
                     
Current player:      Red (ready to play move 3 again)
```

---

## Button 3: SURRENDER (Đầu hàng)

### Visual Flow
```
┌────────────────────────┐
│ Click "Đầu hàng"       │
└────────┬───────────────┘
         ↓
    ┌────────────────────────┐
    │ Show Confirmation      │
    │ "Chắc chắn đầu hàng?"   │
    └───┬──────────────┬──────┘
        │              │
      CANCEL           OK
        │              │
        ↓              ↓
    ┌────────┐   ┌────────────────┐
    │Continue│   │ End game       │
    │game    │   │ Opponent wins  │
    └────────┘   └────────┬───────┘
                         ↓
                  ┌────────────────┐
                  │ Show victory   │
                  │ message        │
                  │ "🏆 [Winner]   │
                  │  CHIẾN THẮNG!" │
                  └────────┬───────┘
                         ↓
                  ┌────────────────┐
                  │ Wait 2 seconds │
                  └────────┬───────┘
                         ↓
                  ┌────────────────┐
                  │ Auto-reset     │
                  │ New game ready │
                  └────────────────┘
```

### Example Scenario
```
Current Player: ĐEN (Black)
Pieces: Red winning (has more pieces)

User (playing Black) clicks "Đầu hàng"
Dialog: "Bạn có chắc chắn muốn đầu hàng?
         Người chơi ĐEN sẽ thua cuộc!"

User clicks OK
                    ↓
Result: "🏆 ĐỎ CHIẾN THẮNG! ĐEN đã đầu hàng!"
                    ↓
        (wait 2 seconds)
                    ↓
New game starts: Fresh board, Red to play first
```

---

## Method Structure

### resetGame() - 35 lines
```javascript
function resetGame() {
    // Reset all state variables
    this.currentPlayer = 'red'
    this.selectedPiece = null
    this.validMoves = []
    this.moveCount = 0
    this.moveHistory = []
    this.capturedPieces = { red: [], black: [] }
    this.gameActive = true
    this.isCheck = false
    
    // Recreate board
    this.taoBanCo()
    
    // Place pieces
    this.datQuanCo()
    
    // Clear UI
    Clear captured pieces display
    Clear move history display
    
    // Update display
    this.capNhatHienThi()
    
    // Show notification
    Show success message
}
```

### hoanTacNuocDi() - 51 lines
```javascript
function hoanTacNuocDi() {
    // Validate
    if (moveHistory.length === 0) {
        Show warning
        return false
    }
    
    // Get last move
    const lastMove = moveHistory.last()
    
    // Reset game
    Reset all state
    Recreate board
    Clear displays
    
    // Notify user
    Show success message
    return true
}
```

### dauHang() - 26 lines
```javascript
function dauHang() {
    // Check if game active
    if (!gameActive) {
        Show warning
        return
    }
    
    // Ask for confirmation
    Show dialog
    
    if (confirmed) {
        // Determine winner
        opponent = other player
        
        // End game
        Show victory message
        Call ketThucGame(opponent)
        
        // Schedule reset
        setTimeout(resetGame, 2000)
    }
}
```

---

## State Machine Diagram

```
                    ┌──────────────┐
                    │  GAME ACTIVE │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ↓              ↓              ↓
       ┌────────┐   ┌──────────┐   ┌──────────┐
       │NEW GAME│   │UNDO MOVE │   │SURRENDER │
       └────┬───┘   └────┬─────┘   └────┬─────┘
            │           │               │
            │           ↓               ↓
            │      ┌──────────┐   ┌──────────────┐
            │      │REWIND 1  │   │CONFIRM QUIT? │
            │      │MOVE BACK │   └──┬──────┬────┘
            │      └────┬─────┘      │      │
            │           │          YES     NO
            │           │           │       │
            │           │           ↓       ↓
            │           └──→ ┌──────────────┐
            │                │   CONTINUE   │
            │                │    GAME      │
            │                └──────────────┘
            │
            └──────────→ ┌──────────────────┐
                         │  GAME RESET      │
                         │  Fresh board     │
                         │  Red to play     │
                         └─────────┬────────┘
                                   ↓
                         ┌──────────────────┐
                         │  GAME ACTIVE     │ (loop back)
                         └──────────────────┘
```

---

## Key Implementation Points

1. **Consistency**: All operations reset board completely for accuracy
2. **User Feedback**: Every action provides notification
3. **Error Handling**: Invalid actions show warnings
4. **Confirmation**: Destructive actions ask for confirmation
5. **Auto-transition**: Surrender automatically starts new game
6. **State Management**: Game state always stays synchronized
7. **Error Recovery**: System can recover from any state

---

## Testing Checklist

- [ ] New Game button resets board completely
- [ ] 32 pieces appear in correct starting positions
- [ ] Undo button removes last move
- [ ] Undo shows warning when no moves exist
- [ ] Surrender shows confirmation dialog
- [ ] Surrender declares opponent winner
- [ ] Surrender auto-resets after 2 seconds
- [ ] All notifications display correctly
- [ ] No console errors
- [ ] Game state remains consistent

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Buttons don't work | Reload page (F5) |
| Wrong winner announced | Check game logic in dauHang() |
| Board not resetting | Check if resetGame() is called |
| No notifications | Check Toastr library loaded |
| Console errors | Open F12 → Console and report |

