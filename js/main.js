// ========== CỜ TƯỚNG ONLINE - MAIN.JS ==========
// Updated: January 23, 2026




// ========== TOASTR CONFIGURATION ==========

if (typeof toastr !== 'undefined') {
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
}

// ========== GLOBAL STATE ==========


let currentPlayer = null;

// ========== MAIN INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    
    try {
        console.log('🚀 Initializing Cờ Tướng Online...');

        // Wait for game engine to initialize
        if (!window.coTuongGame) {
            console.warn('⏳ Waiting for coTuongGame initialization...');
            // Give time for hoan-chinh-co-tuong.js to initialize
            setTimeout(() => {
                if (!window.coTuongGame) {
                    console.error('❌ coTuongGame failed to initialize!');
                } else {
                    console.log('✅ coTuongGame initialized successfully');
                }
            }, 1000);
        } else {
            console.log('✅ coTuongGame ready at DOMContentLoaded');
        }

        loadPlayerFromStorage();
        initializeUserMenu();
        bindKeyboardShortcuts();

        setTimeout(() => {
            showNotification('Chào mừng đến với Cờ Tướng Online! 🎮', 'info');
        }, 500);

        console.log('✅ Initialization complete!');
    } catch (error) {
        console.error('❌ Critical initialization error:', error);
    }
});

window.gameMode = null; // 'ai' | '2p' | 'online'
window.isGameStarted = false;






// ========== GAME CONTROL FUNCTIONS ==========

function newGame() {

    if (!window.coTuongGame) {
        alert("Game chưa khởi tạo!");
        return;
    }

    window.coTuongGame.resetGame();
    showNotification("🎮 Ván mới bắt đầu", "success");
}

function undoMove() {

    if (!window.coTuongGame) return;

    if (typeof window.coTuongGame.hoanTacNuocDi === 'function') {
        window.coTuongGame.hoanTacNuocDi();
    }
}

function showHint() {

    if (!window.coTuongGame) return;

    if (typeof window.coTuongGame.hienThiThongBao === 'function') {
        window.coTuongGame.hienThiThongBao("💡 Chọn quân cờ để xem nước đi");
    }
}

function offerDraw() {
    showNotification("🤝 Chức năng xin hòa đang phát triển", "info");
}

function surrender() {

    if (!window.coTuongGame) return;

    if (typeof window.coTuongGame.dauHang === 'function') {
        window.coTuongGame.dauHang();
    }
}



// ========== PLAYER MANAGEMENT ==========

function playerLogin() {
    console.log("🔐 Player login...");
    const name = prompt("Nhập tên người chơi:", "Kỳ thủ " + Math.floor(Math.random() * 999));
    
    if (name && name.trim()) {
        currentPlayer = {
            name: name.trim(),
            elo: 1200,
            wins: 0,
            losses: 0,
            joinedAt: new Date().toISOString()
        };
        
        // Save to storage
        localStorage.setItem('coTuongPlayer', JSON.stringify(currentPlayer));
        
        // Update UI
        updatePlayerUI();
        
        showNotification(`Chào mừng ${currentPlayer.name} đến với Cờ Tướng! 🎮`, 'success');
        console.log('✅ Logged in as:', currentPlayer.name);
    }
}

function playerLogout() {
    console.log("🚪 Player logout...");
    if (confirm("Bạn có muốn đăng xuất?")) {
        currentPlayer = null;
        localStorage.removeItem('coTuongPlayer');
        updatePlayerUI();
        showNotification('Đã đăng xuất', 'info');
        console.log('✅ Logged out');
    }
}

function updatePlayerUI() {
    const playerName = document.getElementById('playerName');
    const playerElo = document.getElementById('playerElo');
    const loginBtn = document.getElementById('playerLoginBtn');
    const logoutBtn = document.getElementById('playerLogoutBtn');
    
    if (currentPlayer) {
        if (playerName) playerName.textContent = currentPlayer.name;
        if (playerElo) playerElo.textContent = 'ELO: ' + currentPlayer.elo;
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if (playerName) playerName.textContent = 'Khách';
        if (playerElo) playerElo.textContent = 'ELO: -';
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function loadPlayerFromStorage() {
    console.log("📦 Loading player from storage...");
    const saved = localStorage.getItem('coTuongPlayer');
    
    if (saved) {
        try {
            currentPlayer = JSON.parse(saved);
            updatePlayerUI();
            console.log('✅ Loaded player:', currentPlayer.name);
        } catch (e) {
            console.error('❌ Error loading player:', e);
            localStorage.removeItem('coTuongPlayer');
        }
    } else {
        updatePlayerUI();
        console.log('✅ No saved player');
    }
}

// ========== USER MENU INITIALIZATION ==========

function initializeUserMenu() {
    console.log('👥 Initializing user menu...');
    
    // Attach event listeners if elements exist
    const loginBtn = document.getElementById('playerLoginBtn');
    const logoutBtn = document.getElementById('playerLogoutBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', playerLogin);
        console.log('✅ Login button bound');
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', playerLogout);
        console.log('✅ Logout button bound');
    }
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('playerMenu');
        const btn = document.getElementById('playerMenuBtn');
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.style.display = 'none';
        }
    });
}

// ========== KEYBOARD SHORTCUTS ==========

function bindKeyboardShortcuts() {
    console.log('⌨️ Binding keyboard shortcuts...');
    
    document.addEventListener('keydown', (e) => {
        // Skip if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // Ctrl + N: New game
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            newGame();
        }
        
        // Ctrl + U: Undo move
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            undoMove();
        }
        
        // ESC: Close dialogs
        if (e.key === 'Escape') {
            e.preventDefault();
            const modal = document.getElementById('resultModal');
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        }
        
        // H: Help
        if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey) {
            e.preventDefault();
            showHelp();
        }
    });
    
    console.log('✅ Keyboard shortcuts bound');
}

// ========== UTILITY FUNCTIONS ==========

function showNotification(message, type = 'info') {
    if (typeof toastr !== 'undefined') {
        switch(type) {
            case 'success':
                toastr.success(message);
                break;
            case 'error':
                toastr.error(message);
                break;
            case 'warning':
                toastr.warning(message);
                break;
            default:
                toastr.info(message);
        }
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


function getPieceName(piece) {
    const names = {
        '帥': 'Tướng Đỏ', '將': 'Tướng Đen',
        '仕': 'Sĩ Đỏ', '士': 'Sĩ Đen',
        '相': 'Tượng Đỏ', '象': 'Tượng Đen',
        '馬': 'Mã Đỏ', '傌': 'Mã Đen',
        '車': 'Xe Đỏ', '俥': 'Xe Đen',
        '炮': 'Pháo Đỏ', '砲': 'Pháo Đen',
        '兵': 'Binh Đỏ', '卒': 'Tốt Đen'
    };
    return names[piece] || piece;
}




// ========== HELP SYSTEM ==========

function showHelp() {
    console.log('📖 Showing help...');
    
    const helpText = `
🎮 CỜ TƯỚNG ONLINE - HƯỚNG DẪN CHƠI

📋 QUI LUẬT:
• Mỗi loại quân có cách di chuyển riêng
• Chiếu TƯỚNG của đối phương là thắng
• Chơi lần lượt: ĐỎ đi trước

⌨️ PHÍM TẮT:
• Ctrl + N: Ván mới
• Ctrl + U: Hoàn tác
• ESC: Đóng cửa sổ
• H: Trợ giúp

🖱️ CÁCH CHƠI:
1. Bấm chọn quân cần di chuyển
2. Bấm ô đích để di chuyển
3. Để ăn quân, di chuyển tới ô chứa quân địch

💡 MẸO:
• Bảo vệ TƯỚNG là ưu tiên
• Sử dụng PHÁO để ăn quân từ xa
• Đừng để TƯỚNG đơn độc trong CUNG

Hãy chơi và tận hưởng trò chơi cờ tướng!
    `;
    
    alert(helpText);
}

// ========== AUTO-SAVE SYSTEM ==========

// Auto-save game every 60 seconds
setInterval(() => {
    if (window.coTuongGame && typeof window.coTuongGame.saveGameState === 'function') {
        try {
            window.coTuongGame.saveGameState();
        } catch (e) {
            console.log('Auto-save skipped');
        }
    }
}, 60000);


// ========== GAME MODE FUNCTIONS ==========

let gameMode = "online";  // Default mode


// ========== LOG ==========

console.log('✅ Main.js fully loaded and ready!');
console.log('Game shortcuts: Ctrl+N (new), Ctrl+U (undo), H (help), ESC (close)');

// ========== EXPORT FUNCTIONS TO GLOBAL ==========
window.newGame = newGame;
window.undoMove = undoMove;
window.showHint = showHint;
window.offerDraw = offerDraw;
window.surrender = surrender;



// ====== BUTTON FUNCTIONS ======


// ===== FIX MODE BUTTON CLICK =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            console.log("MODE:", mode);

            document.querySelectorAll('.mode-btn')
                .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

           if (mode === 'local') startLocalGame();
if (mode === 'online') startOnlineGame();
        });
    });
});
function startLocalGame() {
    if (!window.coTuongGame) return alert("Game chưa sẵn sàng");
    coTuongGame.playWithAI = false;
    coTuongGame.resetGame();
    showNotification("👥 Chế độ 2 người", "success");
}

function startOnlineGame() {

    if (!window.coTuongGame) {
        alert("Game chưa sẵn sàng");
        return;
    }

    coTuongGame.playWithAI = false;
    coTuongGame.resetGame();

    showNotification("🌐 Chế độ Online", "success");

}
function changeGameMode(mode) {

    gameMode = mode;

    document.querySelectorAll('.mode-btn')
        .forEach(b => b.classList.remove('active'));

    document.querySelector(`[data-mode="${mode}"]`)
        ?.classList.add('active');

    document.getElementById('matchmakingPanel').style.display =
        mode === 'online' ? 'block' : 'none';

    if (window.coTuongGame) {
        coTuongGame.resetGame();
    }

    console.log("🎮 Đã chuyển chế độ:", mode);
}
window.changeGameMode = changeGameMode;
