// ========== UI INTERACTIONS ==========
class UIManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadTournaments();
        this.loadStreams();
        this.loadFriends();
        this.setupLoading();
    }
    
    setupEventListeners() {
        // Chat
        const chatInput = document.getElementById('chatInput');
        const sendChatBtn = document.getElementById('sendChatBtn');
        
        if (chatInput && sendChatBtn) {
            sendChatBtn.addEventListener('click', () => this.sendChatMessage());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
        }
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Tournament lobby
        const tournamentBanner = document.querySelector('.tournament-banner');
        if (tournamentBanner) {
            tournamentBanner.addEventListener('click', () => this.showTournamentLobby());
        }
    }
    
    setupLoading() {
        // Simulate loading progress
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');
        
        if (!loadingBar || !loadingText) return;
        
        const loadingSteps = [
            { text: 'Khởi tạo hệ thống...', progress: 20 },
            { text: 'Tải dữ liệu game...', progress: 40 },
            { text: 'Kết nối server...', progress: 60 },
            { text: 'Khởi tạo AI...', progress: 80 },
            { text: 'Sẵn sàng!', progress: 100 }
        ];
        
        let step = 0;
        const interval = setInterval(() => {
            if (step < loadingSteps.length) {
                loadingText.textContent = loadingSteps[step].text;
                loadingBar.style.width = `${loadingSteps[step].progress}%`;
                step++;
            } else {
                clearInterval(interval);
                
                // Hide loading screen
                setTimeout(() => {
                    const loadingScreen = document.getElementById('loadingScreen');
                    if (loadingScreen) {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 500);
                    }
                }, 500);
            }
        }, 400);
    }
    
    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatInput || !chatMessages || !chatInput.value.trim()) return;
        
        const message = chatInput.value.trim();
        
        // Add message to chat
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `
            <div class="message-sender">Bạn</div>
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        
        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate AI response if playing against AI
        if (chessGame && chessGame.state.gameMode === 'ai') {
            setTimeout(() => {
                const responses = [
                    "Nước đi hay đấy!",
                    "Hmm, thú vị...",
                    "Để tôi suy nghĩ...",
                    "Bạn chơi tốt đấy!",
                    "Trận đấu đang rất hấp dẫn!"
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                const aiMessage = document.createElement('div');
                aiMessage.className = 'message opponent';
                aiMessage.innerHTML = `
                    <div class="message-sender">AI</div>
                    <div class="message-content">${response}</div>
                    <div class="message-time">${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                `;
                
                chatMessages.appendChild(aiMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
    
    loadTournaments() {
        const tournamentList = document.getElementById('tournamentList');
        const tournamentGrid = document.getElementById('tournamentGrid');
        
        const tournaments = [
            {
                id: 1,
                name: 'Giải Vô Địch Mùa Hè',
                prize: '10,000,000 VND',
                players: '128/256',
                time: '14:00 Hàng ngày',
                type: 'blitz'
            },
            {
                id: 2,
                name: 'Cúp Trí Tuệ Việt',
                prize: '5,000,000 VND',
                players: '64/128',
                time: '20:00 Tối thứ 7',
                type: 'rapid'
            },
            {
                id: 3,
                name: 'Đấu Trường Cao Thủ',
                prize: '2,000,000 VND',
                players: '32/64',
                time: '19:00 Hàng ngày',
                type: 'blitz'
            }
        ];
        
        // Populate tournament list in sidebar
        if (tournamentList) {
            tournamentList.innerHTML = '';
            tournaments.forEach(tournament => {
                const item = document.createElement('div');
                item.className = 'tournament-item';
                item.innerHTML = `
                    <h5>${tournament.name}</h5>
                    <p><i class="fas fa-gem"></i> ${tournament.prize}</p>
                    <p><i class="fas fa-clock"></i> ${tournament.time}</p>
                `;
                item.addEventListener('click', () => this.joinTournament(tournament.id));
                tournamentList.appendChild(item);
            });
        }
        
        // Populate tournament grid in modal
        if (tournamentGrid) {
            tournamentGrid.innerHTML = '';
            tournaments.forEach(tournament => {
                const card = document.createElement('div');
                card.className = 'tournament-card';
                card.innerHTML = `
                    <h4>${tournament.name}</h4>
                    <p><i class="fas fa-gem"></i> Giải thưởng: ${tournament.prize}</p>
                    <p><i class="fas fa-users"></i> Người chơi: ${tournament.players}</p>
                    <p><i class="fas fa-clock"></i> Thời gian: ${tournament.time}</p>
                    <p><i class="fas fa-chess-clock"></i> Kiểm soát thời gian: ${tournament.type === 'blitz' ? 'Cờ nhanh' : 'Cờ tiêu chuẩn'}</p>
                    <button class="btn btn-primary btn-block" onclick="joinTournament(${tournament.id})">
                        <i class="fas fa-sign-in-alt"></i> Tham gia ngay
                    </button>
                `;
                tournamentGrid.appendChild(card);
            });
        }
        
        // Update tournament count
        const tournamentCount = document.getElementById('tournamentCount');
        if (tournamentCount) {
            tournamentCount.textContent = tournaments.length;
        }
    }
    
    loadStreams() {
        const streamList = document.getElementById('streamList');
        
        if (!streamList) return;
        
        const streams = [
            {
                id: 1,
                player1: 'VĐV Quốc gia A',
                player2: 'VĐV Quốc gia B',
                viewers: 2345,
                elo1: 2500,
                elo2: 2450
            },
            {
                id: 2,
                player1: 'Kỳ thủ Trẻ',
                player2: 'Cao thủ Online',
                viewers: 1234,
                elo1: 2200,
                elo2: 2300
            }
        ];
        
        streamList.innerHTML = '';
        streams.forEach(stream => {
            const item = document.createElement('div');
            item.className = 'stream-item';
            item.innerHTML = `
                <div class="stream-icon">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="stream-info">
                    <div class="stream-title">${stream.player1} vs ${stream.player2}</div>
                    <div class="stream-details">
                        <span><i class="fas fa-eye"></i> ${stream.viewers}</span>
                        <span><i class="fas fa-chart-line"></i> ${stream.elo1}-${stream.elo2}</span>
                    </div>
                </div>
            `;
            item.addEventListener('click', () => this.watchStream(stream.id));
            streamList.appendChild(item);
        });
    }
    
    loadFriends() {
        const friendsList = document.getElementById('friendsList');
        
        if (!friendsList) return;
        
        const friends = [
            { name: 'Người chơi A', status: 'online', elo: 1800 },
            { name: 'Người chơi B', status: 'online', elo: 1650 },
            { name: 'Người chơi C', status: 'away', elo: 2000 },
            { name: 'Người chơi D', status: 'offline', elo: 1500 }
        ];
        
        friendsList.innerHTML = '';
        friends.forEach(friend => {
            const item = document.createElement('div');
            item.className = 'friend-item';
            item.innerHTML = `
                <div class="friend-avatar ${friend.status}">
                    <i class="fas fa-user"></i>
                </div>
                <div class="friend-info">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-details">
                        <span class="friend-status">${friend.status === 'online' ? 'Online' : friend.status === 'away' ? 'Vắng mặt' : 'Offline'}</span>
                        <span class="friend-elo">${friend.elo} ELO</span>
                    </div>
                </div>
            `;
            friendsList.appendChild(item);
        });
    }
    
    joinTournament(tournamentId) {
        toastr.success('Đã đăng ký tham gia giải đấu!', 'Thành công');
        this.hideTournamentModal();
    }
    
    watchStream(streamId) {
        toastr.info(`Đang mở stream ${streamId}...`, 'Stream');
    }
    
    showTournamentLobby() {
        const modal = document.getElementById('tournamentModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    hideTournamentModal() {
        const modal = document.getElementById('tournamentModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    showDailyRewards() {
        toastr.info('Tính năng quà hàng ngày đang phát triển', 'Quà hàng ngày');
    }
    
    showBattlePass() {
        toastr.info('Tính năng Battle Pass đang phát triển', 'Battle Pass');
    }
    
    startMatchmaking() {
        toastr.info('Đang tìm đối thủ phù hợp...', 'Matchmaking');
        
        // Simulate matchmaking
        setTimeout(() => {
            toastr.success('Đã tìm thấy đối thủ! Bắt đầu ván đấu.', 'Thành công');
        }, 3000);
    }
    
    cancelMatchmaking() {
        toastr.info('Đã hủy tìm trận', 'Matchmaking');
    }
}

// Create global instance
let uiManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
    
    // Global functions for HTML onclick
    window.showTournamentLobby = () => uiManager.showTournamentLobby();
    window.hideTournamentModal = () => uiManager.hideTournamentModal();
    window.joinTournament = (id) => uiManager.joinTournament(id);
    window.showDailyRewards = () => uiManager.showDailyRewards();
    window.showBattlePass = () => uiManager.showBattlePass();
    window.startMatchmaking = () => uiManager.startMatchmaking();
    window.cancelMatchmaking = () => uiManager.cancelMatchmaking();
    window.sendChatMessage = () => uiManager.sendChatMessage();
});