# 🎮 Visual Game State Guide

## Starting State (After "Ván mới" Click)

```
BOARD DISPLAY:
┌─────────────────────────────┐
│ Red Pieces (Top)            │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 帥 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ───────────────────────     │ River
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 將 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ Black Pieces (Bottom)       │
└─────────────────────────────┘

SIDE PANEL:
Status: ĐỎ ĐANG ĐI (Red is playing)
Turn: ĐỎ (Red)

Captured:
ĐỎ bị ăn: [empty]
ĐEN bị ăn: [empty]
```

## After Red Moves Pawn

```
BOARD DISPLAY:
┌─────────────────────────────┐
│ Red Pieces (Top)            │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 帥 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ───────────────────────     │ River
│ ☐ ☐ ☐ ☐ 兵 ☐ ☐ ☐ ☐ ← Moved │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 將 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ Black Pieces (Bottom)       │
└─────────────────────────────┘

SIDE PANEL:
Status: ĐEN ĐANG ĐI (Black is playing)
Turn: ĐEN (Black)

Captured:
ĐỎ bị ăn: [empty]
ĐEN bị ăn: [empty]

CONSOLE:
🎯 Di chuyển Tốt từ [6,4] đến [4,4]
🔄 Đã đổi lượt: black
```

## After Black Moves Pawn to Position for Capture

```
BOARD DISPLAY:
┌─────────────────────────────┐
│ Red Pieces (Top)            │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 帥 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ───────────────────────     │ River
│ ☐ ☐ ☐ 卒 兵 ☐ ☐ ☐ ☐ ← Adjacent │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 將 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ Black Pieces (Bottom)       │
└─────────────────────────────┘

CONSOLE (When Red Selects Pawn):
📍 [3,4] - ÔNG TRỐNG - CÓ THỂ ĐI
📍 [4,3] - CÓ QUÂN ĐỊCH (卒) - CÓ THỂ ĂN  ← This is capture option!
📍 [5,4] - ÔNG TRỐNG - CÓ THỂ ĐI
```

## During Capture - Red Clicks to Capture Black Pawn

```
ACTION: Red clicks square [4,3] to capture

CONSOLE OUTPUT - CAPTURE SEQUENCE:
⚔️ ĂN QUÂN TẠI [4,3]
🔍 Quân bị ăn: 卒 (black)
🍖 ĐANG ĂN QUÂN: Tốt (red) tại [4,3]
   Phía trước: activePieces có 32 quân
✅ Đã xóa quân khỏi activePieces (32 → 31)
✅ Quân đã xóa khỏi DOM tại ô [4,3]
✅ Thêm vào capturedPieces[black]
✅ Hiển thị quân bị ăn ở khu vực: capturedBlack
🔄 Đã đổi lượt: red
```

## After Capture - Board State

```
BOARD DISPLAY:
┌─────────────────────────────┐
│ Red Pieces (Top)            │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 帥 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ───────────────────────     │ River
│ ☐ ☐ ☐ 兵 ☐ ☐ ☐ ☐ ☐ ← Red captured, pawn here │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ 將 ☐ ☐ ☐ ☐ ☐         │
│ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐ ☐         │
│ Black Pieces (Bottom)       │
└─────────────────────────────┘

NOTE: Black pawn that was at [4,3] is GONE from board!

SIDE PANEL:
Status: ĐEN ĐANG ĐI (Black is playing)
Turn: ĐEN (Black)

Captured:
ĐỎ bị ăn: [empty]
ĐEN bị ăn: [卒]  ← Captured piece appears here!

CONSOLE:
🎯 Di chuyển Tốt từ [4,4] đến [4,3]
```

## Multiple Captures Later

```
BOARD DISPLAY:
(Various pieces moved and some captured)

SIDE PANEL:
Status: ĐỎ ĐANG ĐI
Turn: ĐỎ

Captured:
ĐỎ bị ăn: [象][馬]  ← 2 red pieces captured
ĐEN bị ăn: [卒][兵][車]  ← 3 black pieces captured

Each icon shows the piece symbol
```

## Console Debug Commands (F12 Console)

```javascript
// Check what's selected
console.log(coTuongGame.selectedPiece);
// Output: { element: <div>, loai: "兵", mau: "red", hang: 4, cot: 3 }

// Check valid moves
console.log(coTuongGame.validMoves);
// Output: [
//   { hang: 3, cot: 3, laAnQuan: false },
//   { hang: 4, cot: 3, laAnQuan: true, quanBiAn: <div> }
// ]

// Check captured pieces
console.log(coTuongGame.capturedPieces);
// Output: {
//   red: [{loai: "象", mau: "red"}, {loai: "馬", mau: "red"}],
//   black: [{loai: "卒", mau: "black"}]
// }

// Check turn
console.log(coTuongGame.currentPlayer);
// Output: "red" or "black"

// Check piece count
console.log(coTuongGame.activePieces.length);
// Output: 31 (if 1 piece was captured)
```

## Error States

### Capture Failed - No Piece Found
```
CONSOLE:
❌ LỖI: Không có quân để ăn! (quanBiAn = null)

BOARD STATE: Unchanged
ACTION: Try again, may be DOM loading issue
```

### Capture Failed - Missing HTML Element
```
CONSOLE:
❌ LỖI: Không tìm thấy khu vực captured (capturedRed)

BOARD STATE: Piece moves but doesn't show in captured section
ACTION: Check if index.html has correct element IDs
```

### Capture Failed - Bad Piece Data
```
CONSOLE:
❌ LỖI: Quân không có dataset đầy đủ!
   mau: undefined, loaiQuan: undefined

BOARD STATE: Piece may disappear or cause errors
ACTION: Check if pieces created with correct dataset attributes
```

## Expected Behavior Summary

| Action | Console | Board | Captured Section |
|--------|---------|-------|------------------|
| Select piece | "Valid moves" | Highlights | N/A |
| Move to empty | "Di chuyển" | Piece moves | No change |
| Capture | "ĂN QUÂN" sequence | Piece moves, target gone | Icon appears |
| Switch turn | "Đổi lượt" | Turn indicator changes | No change |
| New game | Reset messages | All pieces reset | Cleared |

## Piece Movement Pattern (What You'll See)

```
When you select a pawn:
- Console shows valid squares
- Board shows highlighted squares
- Move forward: ☐ (empty)
- Capture diagonal: 卒 (enemy)

When you click to move:
- If empty: Piece slides there
- If enemy: Piece goes there, enemy disappears

Turn indicator:
- Before move: ĐỎ ĐANG ĐI (Red)
- After move: ĐEN ĐANG ĐI (Black)
```

---

This is what you should see when playing! Compare your actual game with these diagrams to verify capture is working correctly.

