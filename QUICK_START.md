# 🚀 QUICK START - Test Your Game Now

## In 30 Seconds

1. **Open `index.html` in browser**
2. **Click "Ván mới" button**
3. **Press F12 to open Console**
4. **Move red pawn forward by clicking it**
5. **Watch the console output**
6. **Try to capture opponent's piece**
7. **Check if piece disappears and appears in captured section**

---

## What Should Happen

### ✅ If Capture Works:
```
Board: Black piece disappears
Captured section: Shows black piece
Console: Shows all capture steps
Status: Turns to opponent's turn
```

### ❌ If Capture Doesn't Work:
```
Board: Red piece moves but black piece stays
Captured section: Nothing happens
Console: Shows error message
```

---

## Capture Testing Steps

### Method 1: Manual Setup (Best for Testing)
1. Play red - move pawn forward several times
2. Play black - move your pieces to be adjacent to red pawn
3. Play red - select the red pawn
4. Look in console for: `CÓ QUÂN ĐỊCH ... CÓ THỂ ĂN`
5. Click that square
6. Check: Did black piece disappear?

### Method 2: Quick Consecutive Moves
1. Move red pawn forward
2. Move black pawn to adjacent position
3. Move red pawn to capture

---

## Console Debug Checklist

When something doesn't work, check these in console:

```javascript
// Are pieces loaded?
coTuongGame.activePieces.length >= 32
// Result: true

// Are captured areas ready?
document.getElementById('capturedRed') !== null
document.getElementById('capturedBlack') !== null
// Result: true

// Can we find a piece?
document.querySelector('.quan-co')
// Result: <div> element

// Is board ready?
document.getElementById('chessBoard')
// Result: <div> element

// Is game initialized?
coTuongGame
// Result: CoTuongHoanChinh object
```

---

## Expected Console Messages

### When Selecting a Piece:
```
📍 [hang,cot] - ÔNG TRỐNG - CÓ THỂ ĐI
📍 [hang,cot] - ÔNG TRỐNG - CÓ THỂ ĐI
📍 [hang,cot] - CÓ QUÂN ĐỊCH (type) - CÓ THỂ ĂN  ← Capture option!
```

### When Capturing:
```
⚔️ ĂN QUÂN TẠI [hang,cot]
🔍 Quân bị ăn: type (color)
🍖 ĐANG ĂN QUÂN: ...
✅ Đã xóa quân khỏi activePieces
✅ Quân đã xóa khỏi DOM
✅ Thêm vào capturedPieces
✅ Hiển thị quân bị ăn
```

---

## Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| No board | Refresh F5 |
| Pieces not showing | Wait 1 second, DOM loading |
| Can't select pieces | Wrong player's turn |
| Capture doesn't work | Check console for errors |
| New game doesn't work | Click "Ván mới" again |
| Nothing in console | Check if clicking on board |

---

## Files to Check

- ✅ **hoan-chinh-co-tuong.js** - Everything is here
- ✅ **index.html** - Has game board and captured sections
- ✅ **js/main.js** - Connects to game engine
- ✅ **js/game.js** - Disabled (not used)
- ✅ **js/chess-game.js** - Disabled (not used)

---

## Most Important Things

1. **Open Developer Console (F12)**
   - This shows you exactly what's happening
   - You'll see if capture works or fails
   - Error messages tell you what's wrong

2. **Watch Console Output**
   - `⚔️` = Capture in progress
   - `✅` = Step completed successfully
   - `❌` = Step failed
   - `⚠️` = Warning (something unusual)

3. **Check Game Board**
   - Does piece move? Yes = ✓
   - Does captured piece disappear? Yes = ✓
   - Does captured piece appear in section? Yes = ✓

4. **Check Turn**
   - Status should change after each move
   - Turn indicator should switch colors

---

## Test Sequence

```
STEP 1: Start game
Console: "✅ Cờ Tướng sẵn sàng!"

STEP 2: Click red piece
Console: Shows valid moves

STEP 3: Move to empty square
Board: Piece moves
Console: "🎯 Di chuyển..."

STEP 4: Turn switches
Console: "🔄 Đã đổi lượt: black"
Status: Now shows "ĐEN ĐANG ĐI"

STEP 5: Click black piece
Console: Shows valid moves

STEP 6: Try to capture
Board: Check if piece disappears
Console: Check for capture messages
Captured section: Check for icon
```

If ALL of these work, game is PERFECT! ✅

---

## One-Minute Test

```
1. Page loads: board visible ✓
2. Click "Ván mới": board resets ✓
3. F12 opens: console visible ✓
4. Click piece: shows moves ✓
5. Move piece: piece moves ✓
6. Status changes: turn switches ✓
7. Try capture: piece disappears ✓
8. Check captured: icon appears ✓
```

All ✓ = Game working!

---

## Still Not Working?

1. **Copy all console errors**
2. **Open CAPTURE_TESTING_GUIDE.md**
3. **Find matching error**
4. **Follow solution**

Or check:
- CAPTURE_FLOW_DETAILED.md (How it works)
- VISUAL_GAME_STATES.md (What should happen)
- README_FINAL_STATUS.md (Full documentation)

---

## That's It! 

**Your game is ready to test.** Open it now and watch the console while playing!

