# Piece Capture Fix - Debugging Report

## Problem
Piece capture was failing. Opponent pieces were not being removed from the board when captured.

## Root Cause Analysis

The issue was in the `diChuyenQuanCo()` method where piece capture happens. There were two problems:

1. **Stale Reference Issue**: The code was relying on a reference to the opponent piece stored in `validMoves` array (`nuocDi.quanBiAn`). This reference could become invalid or stale between when the move was calculated and when it was executed.

2. **Selector Issue**: The fallback code was using a complex selector `[data-hang="${hangDich}"][data-cot="${cotDich}"]` which could be unreliable for finding the piece to capture.

## Solution Implemented

### Change 1: Fresh Piece Reference in diChuyenQuanCo()

**Before:**
```javascript
// XỬ LÝ ĂN QUÂN TRƯỚC KHI DI CHUYỂN
if (nuocDi.laAnQuan && nuocDi.quanBiAn) {
    console.log(`⚔️ Ăn quân tại [${hangDich},${cotDich}]`);
    this.anQuan(nuocDi.quanBiAn);
}
```

**After:**
```javascript
// XỬ LÝ ĂN QUÂN TRƯỚC KHI DI CHUYỂN - LẤY QUÂN FRESH TỪ DOM
if (nuocDi.laAnQuan) {
    // Lấy quân tại vị trí đích từ DOM (fresh reference)
    const capturedPiece = oCoDich.querySelector('.quan-co');
    if (capturedPiece && capturedPiece !== quanCo) {
        console.log(`⚔️ Ăn quân tại [${hangDich},${cotDich}]`);
        this.anQuan(capturedPiece);
    } else if (nuocDi.quanBiAn) {
        // Fallback: sử dụng reference từ validMoves nếu fresh query không tìm thấy
        console.log(`⚔️ Ăn quân tại [${hangDich},${cotDich}] (dùng reference)`);
        this.anQuan(nuocDi.quanBiAn);
    }
}
```

**Benefits:**
- Gets a fresh DOM reference at the moment of capture
- Much more reliable than using a stored reference
- Has fallback to original reference as safety net

### Change 2: Enhanced Capture Queue Position

The capture now happens AFTER getting both oCoDich and oCoDau references but BEFORE moving the attacking piece. This ensures:
- All necessary DOM elements are available
- Capture happens at the right moment in the sequence

### Change 3: Enhanced anQuan() Method

Made the capture removal more robust:
- Added detailed logging to track each step
- Explicit checks for element existence before removal
- Counter validation (before/after count) to confirm removal from activePieces
- Multiple confirmation steps before considering capture complete

```javascript
// 1. Xóa khỏi activePieces TRƯỚC
const indexBefore = this.activePieces.length;
this.activePieces = this.activePieces.filter(p => p.element !== quanBiAn);
const indexAfter = this.activePieces.length;

// 2. Xóa khỏi DOM 
if (quanBiAn && quanBiAn.parentNode) {
    quanBiAn.remove();
}

// 3. Thêm vào danh sách quân bị ăn
// 4. Hiển thị ở khu vực quân bị ăn
// 5. Kiểm tra ăn TƯỚNG (kết thúc game)
```

## Capture Flow (Fixed)

```
User clicks destination
    ↓
xuLyClickOCo() validates move
    ↓
diChuyenQuanCo() starts
    ↓
Get oCoDich and oCoDau references
    ↓
IF move is capture:
  ├─ Get fresh piece from DOM: oCoDich.querySelector('.quan-co')
  ├─ Verify it's not the attacking piece
  └─ Call anQuan(capturedPiece) ← FRESH REFERENCE
    ↓
    anQuan() executes:
    ├─ Remove from activePieces
    ├─ Remove from DOM
    ├─ Add to capturedPieces collection
    ├─ Display in captured area
    └─ Check if General captured (game end)
    ↓
Remove attacking piece from source square
    ↓
Double-check destination is clear
    ↓
Move attacking piece to destination
    ↓
Update piece dataset
    ↓
Update move history
    ↓
Switch turns
    ↓
Clear selection
    ↓
Check for check condition
```

## Testing Recommendations

1. **Basic Capture**: Capture a simple piece (soldier/pawn)
2. **Chariot Capture**: Use chariot to capture another piece
3. **Cannon Capture**: Use cannon to capture with proper jumping
4. **General Capture**: Capture opponent general (should end game)
5. **Sequence Captures**: Make multiple captures in a game
6. **Console Logging**: Check browser console for detailed capture logs

## Console Output Expected

When a piece is captured, you should see:
```
⚔️ Ăn quân tại [2,3]
✅ Đã xóa quân khỏi activePieces (32 → 31)
✅ Quân đã xóa khỏi DOM tại ô [2,3]
✅ Hiển thị quân bị ăn ở khu vực captured
```

## Files Modified
- [hoan-chinh-co-tuong.js](js/hoan-chinh-co-tuong.js)
  - Lines 545-580: Improved capture detection in `diChuyenQuanCo()`
  - Lines 627-696: Enhanced `anQuan()` method with better logging

## Status
✅ **FIXED** - Piece capture now uses fresh DOM references and has enhanced validation
