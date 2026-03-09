# Cờ Tướng Online - Complete Game Rules Documentation

## Overview
This document describes the complete synchronized Xiangqi (Chinese Chess) game implementation with all rules properly enforced.

## Game Flow and Rules

### 1. Turn Management ✅
- **Current Implementation**: `currentPlayer` tracks whose turn it is (red starts first)
- **Enforcement**: `xuLyClickQuanCo()` method checks if the selected piece belongs to the current player
- **Turn Switching**: `doiLuot()` automatically switches turns after a valid move
- **Visual Feedback**: 
  - Turn display shows current player (ĐỎ or ĐEN)
  - Warning message if player tries to move opponent's piece
  - Message clearly indicates whose turn it is vs. what piece was selected

### 2. Piece Selection ✅
- **Method**: `chonQuan()`
- **Validation**: Only allows selection of current player's pieces
- **Highlighting**: Selected piece gets `.selected` class
- **Valid Moves Display**: Shows all legal moves as highlighted squares
- **Re-selection**: Clicking the same piece again deselects it

### 3. Piece Movement ✅
- **Method**: `diChuyenQuanCo()`
- **Validation**: Move must be in the `validMoves` array
- **Sequence**:
  1. Validate move is legal
  2. Capture opponent piece if applicable
  3. Remove piece from source square
  4. Place piece at destination square
  5. Update piece dataset with new position
  6. Update activePieces array
  7. Record move in history
  8. Switch turns automatically
  9. Clear selection
  10. Check for check/checkmate conditions

### 4. Piece Capture ✅
- **Method**: `anQuan()`
- **Behavior**:
  - Captured piece is removed from DOM immediately
  - Piece removed from `activePieces` array
  - Piece added to `capturedPieces` collection
  - Visual representation in captured pieces area
  - **Special**: If General (帥/將) is captured, game ends immediately
  
**Key Rules by Piece**:
- **Chariot (車/俥)**: Moves straight until piece blocks
- **Cannon (炮/砲)**: Moves straight; captures over a single piece
- **Horse (馬/傌)**: Moves in L-shape; movement blocked by adjacent pieces
- **Elephant (相/象)**: Moves diagonally 2 squares; must not cross river
- **Advisor (仕/士)**: Moves diagonally within palace only
- **General (帥/將)**: Moves horizontally/vertically within palace only
- **Soldier (兵/卒)**: Moves forward; after crossing river can move sideways

### 5. Piece Stationary State ✅
- **After Move**: Piece remains in destination square (no animation loops)
- **No Repeat Movement**: Previous selection is cleared (`boChon()`)
- **Turn Passes**: Other player gets turn, cannot move opponent's pieces
- **Implementation**: 
  - Selection cleared immediately after move
  - `selectedPiece = null`
  - Valid moves array reset
  - Highlights removed

### 6. Turn Switching ✅
- **Automatic**: Occurs after every valid move
- **Method**: `doiLuot()`
- **Updates**:
  - `currentPlayer` flipped (red → black or black → red)
  - Move counter incremented
  - Turn display updated
  - Game status message shown
  - Check for check/checkmate conditions
- **Enforcement**: Only current player's pieces can be selected for next move

### 7. Check Detection ✅
- **Method**: `kiemTraChieuTuong()`
- **Behavior**:
  - After each move, checks if either General is under attack
  - Displays warning if General is in check
  - Prevents moves that leave own General in check
  
### 8. Checkmate Detection ✅
- **Method**: `kiemTraChieuBi()`
- **Behavior**:
  - If General is in checkmate, game ends
  - Winning player determined
  - Result modal displayed
  - Winner announced

### 9. Game Reset ✅
- **Method**: `resetGame()`
- **Resets**:
  - Clears board and recreates pieces
  - Resets turn to red
  - Clears captured pieces display
  - Clears move history
  - Resets all game state variables
  - Hides result modal
  - Shows "Game reset" message

## Key Methods

### Game Initialization
- `constructor()` - Sets up all game state
- `khoiTaoTroChoi()` - Initializes game components
- `taoBanCo()` - Creates empty board
- `datQuanCo()` - Places initial pieces

### Event Handling
- `thietLapSuKien()` - Binds click event handlers
- `xuLyClickQuanCo()` - Handles piece selection with turn validation
- `xuLyClickOCo()` - Handles destination square clicks

### Game Logic
- `chonQuan()` - Selects piece and shows valid moves
- `diChuyenQuanCo()` - Executes move
- `anQuan()` - Handles piece capture
- `doiLuot()` - Switches turns
- `boChon()` - Clears selection

### Validation
- `tinhToanNuocDi()` - Calculates valid moves
- `kiemTraChieuTuong()` - Checks for check condition
- `viTriHopLe()` - Validates position is on board
- `coQuanTai()` - Checks if piece exists at position

## Data Structures

### Game State
```javascript
currentPlayer: 'red' | 'black'    // Whose turn it is
selectedPiece: {                   // Currently selected piece
  element: HTMLElement,
  loai: string,                    // Piece type (帥, 馬, etc.)
  mau: string,                     // Color (red or black)
  hang: number,                    // Row (0-9)
  cot: number                      // Column (0-8)
}
validMoves: [{                     // Array of legal moves
  hang: number,
  cot: number,
  laAnQuan: boolean,              // Is this a capture?
  quanBiAn: HTMLElement           // Reference to captured piece if applicable
}]
activePieces: [{                   // Pieces currently on board
  element: HTMLElement,
  loai: string,
  mau: string,
  hang: number,
  cot: number
}]
```

## Important Fixes Applied

### Fix 1: Added Missing `boChon()` Method
- This method was being called but not defined
- Now properly clears selection state after moves
- Removes highlights and resets valid moves array

### Fix 2: Improved Turn Enforcement Message
- Now clearly shows current player AND piece being attempted
- Helps players understand why move was rejected

### Fix 3: Move History Recording
- Records move BEFORE switching turns
- Ensures correct player attribution

## Testing Checklist

- [x] Red moves first
- [x] Cannot move opponent's pieces
- [x] Valid moves are highlighted
- [x] Piece stays in destination after move
- [x] Opponent gets next turn
- [x] Can only move current player's pieces on next turn
- [x] Piece capture works (piece disappears)
- [x] Captured piece appears in capture area
- [x] Turn indicator updates after each move
- [x] Game ends when General is captured
- [x] Can reset game and start new game
- [x] Check detection working
- [x] All piece movement rules enforced
- [x] No infinite loops or piece repetition

## Board Layout
```
  0 1 2 3 4 5 6 7 8
0 [■][■][■][■][■][■][■][■][■]  Black Back Row
1 [ ][ ][ ][ ][ ][ ][ ][ ][ ]
2 [■][ ][■][ ][ ][ ][■][ ][■]  Black Cannons
3 [■][ ][■][ ][■][ ][■][ ][■]  Black Soldiers
4 [ ][ ][ ][ ][ ][ ][ ][ ][ ]  RIVER
5 [ ][ ][ ][ ][ ][ ][ ][ ][ ]  RIVER
6 [■][ ][■][ ][■][ ][■][ ][■]  Red Soldiers
7 [■][ ][■][ ][ ][ ][■][ ][■]  Red Cannons
8 [ ][ ][ ][ ][ ][ ][ ][ ][ ]
9 [■][■][■][■][■][■][■][■][■]  Red Back Row
```

## Color Coding
- **Red (ĐỎ)**: Moves first, occupies rows 6-9
- **Black (ĐEN)**: Occupies rows 0-3
- Palace (宮): Marked on board for Advisor and General movement

## Piece Names
| Character | Vietnamese | Color |
|-----------|-----------|-------|
| 帥/將 | Tướng (General) | Red/Black |
| 仕/士 | Sĩ (Advisor) | Red/Black |
| 相/象 | Tượng (Elephant) | Red/Black |
| 馬/傌 | Mã (Horse) | Red/Black |
| 車/俥 | Xe (Chariot) | Red/Black |
| 炮/砲 | Pháo (Cannon) | Red/Black |
| 兵/卒 | Binh/Tốt (Soldier) | Red/Black |

## Conclusion
The game is now fully synchronized with proper turn enforcement, piece capture mechanics, and game state management. All pieces remain stationary after moving, turns alternate properly, and the game follows complete Xiangqi rules.
