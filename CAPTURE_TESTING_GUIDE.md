# 🎮 Piece Capture Debugging & Testing Guide

## What I Fixed

### 1. Enhanced Debugging Output
I added detailed console logging to help track exactly what's happening when you try to capture:

**When calculating valid moves:**
- Shows every square being evaluated
- Indicates if there's an enemy piece (CÓ QUÂN ĐỊCH - CÓ THỂ ĂN)
- Shows if square is empty (ÔNG TRỐNG - CÓ THỂ ĐI)
- Shows if there's a friendly piece (CÓ QUÂN CÙNG MÀU - KHÔNG THỂ ĐI)

**When executing capture:**
- Shows exact piece being captured with type and color
- Shows before/after piece count in activePieces array
- Confirms removal from DOM
- Confirms addition to capturedPieces array
- Shows where piece is displayed (capturedRed or capturedBlack)

### 2. Better Error Detection
Added checks for:
- Missing piece data attributes (mau, loai)
- Missing parentNode
- Missing captured areas (capturedRed, capturedBlack)
- Failed DOM removal

---

## How to Test Capture Now

### Step 1: Open Browser Console
1. Press F12 to open Developer Tools
2. Click "Console" tab
3. Keep this open while testing

### Step 2: Click "Ván mới" (New Game)
- Watch console for:
  ```
  ✅ Cờ Tướng sẵn sàng!
  ```

### Step 3: Move a Red Piece
1. Click a red piece (e.g., red pawn on row 6)
2. Watch console for valid moves:
   ```
   📍 [3,4] - ÔNG TRỐNG - CÓ THỂ ĐI
   📍 [4,4] - ÔNG TRỐNG - CÓ THỂ ĐI
   ```
3. Click a destination

### Step 4: Position for Capture
Manually move pieces to create a capture opportunity:
- Move red piece next to black piece
- When showing valid moves, you should see:
  ```
  📍 [4,3] - CÓ QUÂN ĐỊCH (兵) - CÓ THỂ ĂN
  ```

### Step 5: Execute Capture
1. Click on the enemy piece square
2. Watch console for:
   ```
   ⚔️ ĂN QUÂN TẠI [4,3]
   🔍 Quân bị ăn: 兵 (black)
   🍖 ĐANG ĂN QUÂN: Tốt (black) tại [4,3]
   Phía trước: activePieces có 32 quân
   ✅ Đã xóa quân khỏi activePieces (32 → 31)
   ✅ Quân đã xóa khỏi DOM tại ô [4,3]
   ✅ Thêm vào capturedPieces[black]
   ✅ Hiển thị quân bị ăn ở khu vực: capturedBlack
   ```

3. Check the game board:
   - Black piece should be GONE from board
   - Red piece should be at that square
   - Black piece should appear in "ĐEN bị ăn" section

### Step 6: Verify Display
- Look at "ĐEN bị ăn" section on the right
- Should show the black piece that was captured
- Symbol should match the piece type

---

## Console Error Messages & Solutions

### Error 1: "❌ LỖI: Không có quân để ăn! (quanBiAn = null)"
**Cause:** The destination square is not being found correctly
**Solution:** Check if the board squares have `data-hang` and `data-cot` attributes

### Error 2: "❌ LỖI: Quân không có dataset đầy đủ!"
**Cause:** Piece element doesn't have `data-mau` and `data-loai` attributes
**Solution:** Check piece creation in `taoQuanCo()` method

### Error 3: "❌ LỖI: Không tìm thấy khu vực captured"
**Cause:** HTML elements `capturedRed` or `capturedBlack` don't exist
**Solution:** Check index.html for these elements

### Error 4: "⚠️ CẢNH BÁO: Nước đi được đánh dấu là ăn quân nhưng không tìm thấy quân để ăn!"
**Cause:** Move validation thinks it should capture but piece is missing
**Solution:** Check if piece was removed accidentally by another operation

---

## Testing Checklist

### ✅ Board Initialization
- [ ] "Ván mới" button resets board
- [ ] 32 pieces display correctly
- [ ] Red pieces at top, black at bottom
- [ ] All pieces have correct symbols

### ✅ Valid Moves Detection
- [ ] When selecting red pawn, console shows available moves
- [ ] Some moves marked as "ÔNG TRỐNG" (empty)
- [ ] When selecting piece next to opponent, shows "CÓ QUÂN ĐỊCH"

### ✅ Turn Enforcement
- [ ] Red can move red pieces
- [ ] Cannot move black pieces (error shown)
- [ ] After red move, turn switches to black

### ✅ Piece Capture
- [ ] Position red piece next to black piece
- [ ] Valid moves show capture option: "CÓ QUÂN ĐỊCH"
- [ ] Execute capture
- [ ] Black piece disappears from board
- [ ] Red piece remains at capture square
- [ ] Console shows all capture steps completed
- [ ] Captured piece appears in correct section

### ✅ Captured Pieces Display
- [ ] Pieces show in "ĐỎ bị ăn" when red captured
- [ ] Pieces show in "ĐEN bị ăn" when black captured
- [ ] Multiple captures accumulate
- [ ] Each piece displays with correct symbol

---

## Advanced Testing

### Test 1: Capture Different Piece Types
Try capturing:
- [ ] Soldier/Pawn (兵/卒)
- [ ] Chariot (車/俥)
- [ ] Horse (馬/傌)
- [ ] Cannon (炮/砲)
- [ ] Elephant (相/象)
- [ ] Advisor (仕/士)

### Test 2: Multiple Consecutive Captures
1. Make first capture
2. Verify it worked
3. Make another capture
4. Verify captured pieces section shows both

### Test 3: General/King Capture
- Try to capture opponent's General (帥/將)
- Game should end immediately
- Winner should be announced

---

## Expected Console Output - Full Capture Sequence

```
🎮 Khởi động Cờ Tướng Online...
✅ Cờ Tướng sẵn sàng!
(Red selects pawn)
📍 [3,4] - ÔNG TRỐNG - CÓ THỂ ĐI
📍 [4,4] - ÔNG TRỐNG - CÓ THỂ ĐI
(Red moves piece)
🎯 Di chuyển Tốt từ [6,4] đến [4,4]
🔄 Đã đổi lượt: black
(Black moves)
🎯 Di chuyển Tốt từ [3,4] đến [4,4]
⚔️ ĂN QUÂN TẠI [4,4]
🔍 Quân bị ăn: 兵 (red)
🍖 ĐANG ĂN QUÂN: Tốt (red) tại [4,4]
   Phía trước: activePieces có 32 quân
✅ Đã xóa quân khỏi activePieces (32 → 31)
✅ Quân đã xóa khỏi DOM tại ô [4,4]
✅ Thêm vào capturedPieces[red]
✅ Hiển thị quân bị ăn ở khu vực: capturedRed
🔄 Đã đổi lượt: red
```

---

## If Capture Still Doesn't Work

1. **Check Console**: Look for any red error messages
2. **Check Network Tab**: Make sure all JS files loaded
3. **Reload Page**: Sometimes helps with cache issues
4. **Check HTML**: Verify `capturedRed` and `capturedBlack` elements exist
5. **Check Browser**: Try different browser (Chrome, Firefox)
6. **Report Message**: Copy console messages when capture fails

---

## Quick Debug Command

You can type this in console to test capture manually:

```javascript
// Find a captured pieces container
const capturedRed = document.getElementById('capturedRed');

// Check if it exists
console.log('capturedRed exists:', !!capturedRed);

// Check activePieces
console.log('Total pieces:', coTuongGame.activePieces.length);

// Check captured pieces
console.log('Captured red:', coTuongGame.capturedPieces.red);
console.log('Captured black:', coTuongGame.capturedPieces.black);

// Find all pieces on board
const pieces = document.querySelectorAll('.quan-co');
console.log('Pieces in DOM:', pieces.length);
```

---

## Summary

- ✅ All capture logic is in **hoan-chinh-co-tuong.js** only
- ✅ No file switching happens
- ✅ Enhanced debugging shows exactly what's happening
- ✅ Capture pieces display in their sections
- ✅ Turn switches automatically

**Test now with the console open and report what messages you see!**

