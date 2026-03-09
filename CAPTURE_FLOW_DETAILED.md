# 🔍 Complete Capture Flow Diagram & Verification

## Capture Mechanism - Complete Flow

```
USER CLICKS ON RED PAWN → xuLyClickQuanCo() called
    ↓
    TURN CHECK: Is it red's turn? YES ✓
    ↓
    SELECTION: Store selected piece info
    ↓
    CALCULATION: Call tinhToanNuocDi()
    ↓
    VALIDATE MOVES: For each legal square...
    ├─ Check if square is valid viTriHopLe()
    ├─ Call kiemTraVaThemNuocDi()
    │   ├─ Is there a piece here? coQuanTai()
    │   ├─ If YES:
    │   │   ├─ Get piece: layQuanTai()
    │   │   ├─ Is it enemy? dataset.mau !== mau
    │   │   ├─ YES → Add to validMoves with:
    │   │   │       { hang, cot, laAnQuan: TRUE, quanBiAn: piece }
    │   │   └─ NO → Don't add (same color piece)
    │   └─ If NO (empty):
    │       ├─ Add to validMoves with:
    │       └─ { hang, cot, laAnQuan: FALSE }
    └─ Continue for all valid positions

    Display highlights for valid moves

USER CLICKS ON BLACK PAWN TO CAPTURE
    ↓
    xuLyClickOCo() called for that square
    ↓
    FIND MOVE: Find matching move in validMoves array
    ↓
    CHECK: Is laAnQuan === true? YES ✓
    ↓
    CAPTURE EXECUTION: diChuyenQuanCo() called
    │
    ├─ Get fresh piece from DOM:
    │  capturedPiece = oCoDich.querySelector('.quan-co')
    │
    ├─ If found → Call anQuan(capturedPiece)
    │              │
    │              ├─ Extract piece info (mau, loaiQuan, hang, cot)
    │              ├─ Remove from activePieces array (32 → 31)
    │              ├─ Remove from DOM (piece disappears visually)
    │              ├─ Add to capturedPieces[mau]
    │              ├─ Create icon in capturedRed/capturedBlack
    │              └─ Check if General captured → End game
    │
    ├─ Remove attacking piece from source square
    ├─ Move attacking piece to destination
    ├─ Update piece dataset coordinates
    ├─ Update piece in activePieces array
    ├─ Record move in history
    ├─ Switch turn (red → black)
    ├─ Clear selection
    └─ Check for check condition

END - Turn passes to opponent
```

---

## What Each Function Does

### 1. `xuLyClickQuanCo(quanCo)` - Piece Selection Handler
**When:** User clicks on a piece  
**Does:**
- Verify it's the current player's piece
- Calculate legal moves
- Highlight valid moves on board
- Store selected piece info

**Key Check:**
```javascript
if (quanCo.dataset.mau !== this.currentPlayer) {
    // Show error, cannot select
    return;
}
```

### 2. `tinhToanNuocDi(hang, cot, quanCo)` - Calculate Legal Moves
**When:** Piece is selected  
**Does:**
- Based on piece type, find all legal positions
- Call `kiemTraVaThemNuocDi()` for each position
- Mark moves as either capture or normal

**Returns:** `validMoves` array

### 3. `kiemTraVaThemNuocDi(hang, cot, mau)` - Validate Single Move
**When:** For each potential legal move  
**Does:**
- Check if position is valid
- Check if piece exists at that position
- If enemy piece: Mark as capture `laAnQuan: true`
- If empty: Mark as normal `laAnQuan: false`
- If friendly: Don't add move

**Important:**
```javascript
if (coQuanTaiDay) {
    const quanTaiViTri = this.layQuanTai(hang, cot);
    if (quanTaiViTri && quanTaiViTri.dataset.mau !== mau) {
        // ENEMY PIECE - CAN CAPTURE
        this.validMoves.push({
            hang, cot,
            laAnQuan: true,
            quanBiAn: quanTaiViTri  // Store the piece!
        });
    }
}
```

### 4. `xuLyClickOCo(oCo)` - Destination Square Click Handler
**When:** User clicks a square to move to  
**Does:**
- Find matching move in `validMoves`
- If capture move: Call `diChuyenQuanCo()`
- Otherwise: Call `diChuyenQuanCo()`

### 5. `diChuyenQuanCo(hangDich, cotDich)` - Execute Move
**When:** Move is validated  
**Does:**
- Check if move exists in validMoves
- If capture (`laAnQuan === true`):
  - Get fresh piece reference from DOM
  - Call `anQuan(capturedPiece)`
- Move piece to destination
- Update piece coordinates
- Record move
- Switch turn

**Key Capture Detection:**
```javascript
if (nuocDi.laAnQuan) {
    const capturedPiece = oCoDich.querySelector('.quan-co');
    if (capturedPiece && capturedPiece !== quanCo) {
        this.anQuan(capturedPiece);
    } else if (nuocDi.quanBiAn) {
        this.anQuan(nuocDi.quanBiAn);
    }
}
```

### 6. `anQuan(quanBiAn)` - Execute Capture
**When:** Piece captured  
**Does:**
1. Extract piece info (color, type, position)
2. Remove piece from `activePieces` array
3. Remove piece from DOM (disappears)
4. Add to `capturedPieces[color]` array
5. Create display icon in captured section
6. If General captured: End game

**Critical Code:**
```javascript
anQuan(quanBiAn) {
    // 1. Remove from array
    this.activePieces = this.activePieces.filter(p => p.element !== quanBiAn);
    
    // 2. Remove from DOM
    quanBiAn.remove();
    
    // 3. Add to captured list
    this.capturedPieces[mau].push({ loai: loaiQuan, mau: mau });
    
    // 4. Display in UI
    const khuVucAn = mau === 'red' 
        ? document.getElementById('capturedRed')
        : document.getElementById('capturedBlack');
    const icon = document.createElement('div');
    icon.className = `captured-icon ${mau}-piece`;
    icon.textContent = loaiQuan;
    khuVucAn.appendChild(icon);
}
```

---

## Data Structures

### Selected Piece
```javascript
this.selectedPiece = {
    element: <DOM element>,
    loai: '兵',           // Piece type
    mau: 'red',          // Color
    hang: 6,             // Row
    cot: 4               // Column
}
```

### Valid Move (Normal)
```javascript
{
    hang: 4,
    cot: 4,
    laAnQuan: false
}
```

### Valid Move (Capture)
```javascript
{
    hang: 4,
    cot: 4,
    laAnQuan: true,
    quanBiAn: <DOM element of piece to capture>
}
```

### Captured Pieces
```javascript
this.capturedPieces = {
    red: [
        { loai: '兵', mau: 'red' },
        { loai: '馬', mau: 'red' }
    ],
    black: [
        { loai: '車', mau: 'black' }
    ]
}
```

---

## HTML Structure Requirements

### Board
```html
<div class="chess-board" id="chessBoard">
    <!-- Auto-generated by taoBanCo() -->
    <div class="board-square" data-hang="0" data-cot="0">
        <div class="quan-co red-quan" data-loai="馬" data-mau="red" data-hang="0" data-cot="0">
            馬
        </div>
    </div>
    <!-- ... more squares ... -->
</div>
```

### Captured Pieces Display
```html
<div class="captured-display">
    <div class="captured-section">
        <h4>ĐỎ bị ăn:</h4>
        <div class="captured-pieces" id="capturedRed">
            <!-- Captured pieces appear here as:
            <div class="captured-icon red-piece">兵</div>
            -->
        </div>
    </div>
    <div class="captured-section">
        <h4>ĐEN bị ăn:</h4>
        <div class="captured-pieces" id="capturedBlack">
            <!-- Captured pieces appear here -->
        </div>
    </div>
</div>
```

---

## Verification Points

### Before Move
- [ ] `selectedPiece` contains correct piece
- [ ] `currentPlayer` matches piece color
- [ ] `validMoves` array populated
- [ ] Highlight shows on board

### During Capture Detection
- [ ] `nuocDi.laAnQuan === true`
- [ ] Fresh piece found: `oCoDich.querySelector('.quan-co')`
- [ ] Piece has `dataset.mau` and `dataset.loai`

### During anQuan() Execution
- [ ] Piece removed from DOM
- [ ] Piece count decreases in `activePieces`
- [ ] `capturedPieces[mau]` array grows
- [ ] Icon created and displayed

### After Capture
- [ ] Board shows piece gone from old square
- [ ] Board shows capturing piece at new square
- [ ] Captured piece visible in captured section
- [ ] Turn switched to opponent
- [ ] Turn message updated

---

## Test Case: Simple Pawn Capture

**Initial:** Red pawn at [6,4], Black pawn at [4,4]

**Step 1:** Red moves pawn [6,4] → [5,4]
- Console: `🎯 Di chuyển Tốt từ [6,4] đến [5,4]`
- Board: Pawn now at [5,4]
- Turn: Switches to black

**Step 2:** Black moves pawn [4,4] → [5,4] (CAPTURE!)
- Console shows valid move:
  ```
  📍 [5,4] - CÓ QUÂN ĐỊCH (兵) - CÓ THỂ ĂN
  ```
- Black clicks capture square
- Console shows capture sequence:
  ```
  ⚔️ ĂN QUÂN TẠI [5,4]
  🍖 ĐANG ĂN QUÂN: Tốt (red) tại [5,4]
  ✅ Đã xóa quân khỏi activePieces (32 → 31)
  ✅ Quân đã xóa khỏi DOM
  ✅ Thêm vào capturedPieces[red]
  ✅ Hiển thị quân bị ăn
  ```
- Board: Red pawn gone, black pawn at [5,4]
- Captured section: Red pawn symbol appears in "ĐỎ bị ăn"
- Turn: Switches to red

**Success!** ✅

---

## What Can Go Wrong

| Problem | Cause | Solution |
|---------|-------|----------|
| Piece not captured | `laAnQuan` not set to true | Check `kiemTraVaThemNuocDi()` |
| Capture marked but piece stays | Fresh DOM query failing | Check `layOCo()` and `querySelector()` |
| Piece removed but capture icon doesn't show | `capturedRed`/`capturedBlack` missing | Check HTML elements |
| All pieces stay (capture not detected) | Valid move not found in array | Check `validMoves` population |
| Turn doesn't switch | `doiLuot()` not called | Check `diChuyenQuanCo()` completion |
| Piece highlighted but can't move | Selection cleared prematurely | Check `boChon()` calls |

---

## Debug Commands for Console

```javascript
// Check selected piece
console.log('Selected:', coTuongGame.selectedPiece);

// Check valid moves
console.log('Valid moves:', coTuongGame.validMoves);

// Check captured pieces
console.log('Red captured:', coTuongGame.capturedPieces.red);
console.log('Black captured:', coTuongGame.capturedPieces.black);

// Check active pieces
console.log('Active pieces count:', coTuongGame.activePieces.length);

// Check current player
console.log('Current player:', coTuongGame.currentPlayer);

// Check HTML elements
console.log('CapturedRed exists:', !!document.getElementById('capturedRed'));
console.log('CapturedBlack exists:', !!document.getElementById('capturedBlack'));

// Manually trigger capture (for testing)
const blackPiece = document.querySelector('[data-mau="black"][data-hang="4"][data-cot="4"]');
if (blackPiece) coTuongGame.anQuan(blackPiece);
```

