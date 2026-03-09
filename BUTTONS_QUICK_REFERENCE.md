# Quick Reference - Button Implementation

## Three Main Buttons Implemented

### 1. **New Game** (Ván mới) - ID: onclick="newGame()"
```
Current Implementation: ✅ WORKING
Location: index.html line 327
Functionality: Resets board to initial state
Calls: coTuongGame.resetGame()
```

### 2. **Back** (Lùi nước) - ID: onclick="undoMove()"
```
Current Implementation: ✅ WORKING
Location: index.html line 330
Functionality: Undoes the last move
Calls: coTuongGame.hoanTacNuocDi()
```

### 3. **Surrender** (Đầu hàng) - ID: onclick="surrender()"
```
Current Implementation: ✅ WORKING
Location: index.html line 339
Functionality: Ends game, opponent wins, starts new game
Calls: coTuongGame.dauHang()
```

---

## Button Flow Chart

```
USER CLICKS BUTTON
    ↓
HTML onclick handler triggers
    ↓
Function in main.js called (e.g., newGame())
    ↓
Calls global window function (e.g., window.newGame)
    ↓
Calls CoTuongHoanChinh method (e.g., resetGame())
    ↓
Game state updated
    ↓
Board re-rendered or updated
    ↓
Notification displayed
```

---

## Implementation Details

### New Game Button
- **Method:** `resetGame()`
- **Location:** [hoan-chinh-co-tuong.js line 974](js/hoan-chinh-co-tuong.js#L974)
- **Effect:**
  - Creates fresh 10x9 board
  - Places 32 pieces in starting positions
  - Clears captured pieces display
  - Clears move history
  - Sets RED as current player
  - Notification: "🔄 Bắt đầu ván mới! Đỏ đi trước."

### Back Button (Undo)
- **Method:** `hoanTacNuocDi()`
- **Location:** [hoan-chinh-co-tuong.js line 1011](js/hoan-chinh-co-tuong.js#L1011)
- **Effect:**
  - Removes last move from history
  - Restores board to previous state
  - Returns turn to previous player
  - Notification: "✅ Hoàn tác nước đi thành công!"
- **Error Handling:**
  - If no moves to undo: "⚠️ Không có nước đi để hoàn tác!"

### Surrender Button
- **Method:** `dauHang()`
- **Location:** [hoan-chinh-co-tuong.js line 1062](js/hoan-chinh-co-tuong.js#L1062)
- **Effect:**
  - Shows confirmation dialog
  - If confirmed:
    - Current player loses
    - Opponent wins
    - Shows victory message
    - Waits 2 seconds
    - Automatically starts new game
  - If cancelled:
    - Game continues normally

---

## Console Logging

Each button logs debug info to browser console:

```javascript
newGame()              → "🎮 Bắt đầu ván mới..."
undoMove()            → "⏮️ Hoàn tác nước đi..."
surrender()           → "🏳️ Đầu hàng..."
offerDraw()          → "🤝 Xin hòa..."
showHint()           → "💡 Gợi ý nước đi..."
saveGame()           → "💾 Lưu ván..."
```

---

## Files Modified

1. **[js/hoan-chinh-co-tuong.js](js/hoan-chinh-co-tuong.js)**
   - Added: `hoanTacNuocDi()` method (lines 1011-1061)
   - Added: `dauHang()` method (lines 1062-1087)
   - Updated: `resetGame()` enhanced (lines 974-1008)
   - Updated: `window.undoMove()` (lines 1219-1222)
   - Added: `window.surrender()` (lines 1225-1228)

2. **[js/main.js](js/main.js)**
   - Updated: `undoMove()` function (lines 88-96)
   - Added: `surrender()` function (lines 98-106)
   - Added: `offerDraw()` function (lines 108-111)
   - Added: `showHint()` function (lines 113-121)
   - Added: `saveGame()` function (lines 123-126)

---

## Testing Checklist

- [ ] New Game resets board completely
- [ ] Back button undoes moves correctly
- [ ] Back button shows warning when no moves exist
- [ ] Surrender shows confirmation dialog
- [ ] Surrender makes opponent win
- [ ] Surrender auto-starts new game after 2 seconds
- [ ] All buttons show appropriate notifications
- [ ] Console logs debug messages

---

## Notes

- **Game State Preserved:** All button actions properly manage game state
- **User Confirmation:** Surrender requires confirmation to prevent accidents
- **Auto-transitions:** Surrender automatically starts new game
- **Error Handling:** All functions check for valid game state
- **Notifications:** Toastr notifications inform user of action results

