// ========== GAME CONFIGURATION ==========
const GameConfig = {
    // Board Settings
    BOARD_SIZE: {
        width: 9,
        height: 10
    },
    
    // Time Controls
    TIME_CONTROLS: {
        bullet: 60,      // 1 minute
        blitz: 180,      // 3 minutes
        rapid: 600,      // 10 minutes
        classical: 1800  // 30 minutes
    },
    
    // AI Levels
    AI_LEVELS: {
        1: { name: "Dễ", depth: 1, thinkingTime: 500 },
        2: { name: "Trung bình", depth: 2, thinkingTime: 1000 },
        3: { name: "Khá", depth: 3, thinkingTime: 2000 },
        4: { name: "Khó", depth: 4, thinkingTime: 3000 },
        5: { name: "Cao thủ", depth: 5, thinkingTime: 5000 }
    },
    
    // Piece Values
    PIECE_VALUES: {
        king: 1000,
        advisor: 20,
        elephant: 20,
        horse: 45,
        chariot: 90,
        cannon: 45,
        soldier: 10,
        teacher: 30,
        north: 50
    },
    
    // Piece Types
    PIECE_TYPES: {
        '帥': 'king', '將': 'king',
        '仕': 'advisor', '士': 'advisor',
        '相': 'elephant', '象': 'elephant',
        '馬': 'horse', '傌': 'horse',
        '車': 'chariot', '俥': 'chariot',
        '炮': 'cannon', '砲': 'cannon',
        '兵': 'soldier', '卒': 'soldier',
        '北': 'north',
        '師': 'teacher'
    },
    
    // Colors
    COLORS: {
        red: '#FF0000',
        black: '#000000',
        gold: '#FFD700',
        darkRed: '#8B0000'
    },
    
    // Game Modes
    GAME_MODES: {
        AI: 'ai',
        LOCAL: 'local',
        ONLINE: 'online'
    },
    
    // Sound Effects
    SOUNDS: {
        MOVE: 'move',
        CAPTURE: 'capture',
        CHECK: 'check',
        CHECKMATE: 'checkmate',
        DRAW: 'draw',
        RESIGN: 'resign',
        NOTIFY: 'notify'
    },
    
    // Storage Keys
    STORAGE_KEYS: {
        USER_DATA: 'chess_user_data',
        GAME_STATE: 'chess_game_state',
        SETTINGS: 'chess_settings',
        STATS: 'chess_stats',
        TOURNAMENTS: 'chess_tournaments'
    },
    
    // API Endpoints
    API: {
        BASE_URL: 'https://api.cotuongonline.com/v1',
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        MATCHMAKING: '/matchmaking',
        TOURNAMENTS: '/tournaments',
        LEADERBOARD: '/leaderboard',
        STATS: '/stats'
    },
    
    // Achievement Types
    ACHIEVEMENTS: {
        FIRST_WIN: {
            id: 'first_win',
            name: 'Chiến thắng đầu tiên',
            description: 'Chiến thắng ván cờ đầu tiên',
            icon: '🏆',
            points: 100
        },
        STREAK_5: {
            id: 'streak_5',
            name: 'Chuỗi thắng 5',
            description: 'Thắng 5 ván liên tiếp',
            icon: '🔥',
            points: 250
        },
        EL0_1500: {
            id: 'elo_1500',
            name: 'Kỳ thủ nghiệp dư',
            description: 'Đạt 1500 ELO',
            icon: '⭐',
            points: 500
        },
        PERFECT_GAME: {
            id: 'perfect_game',
            name: 'Ván cờ hoàn hảo',
            description: 'Chiến thắng mà không mất quân nào',
            icon: '👑',
            points: 1000
        }
    },
    
    // Rewards
    REWARDS: {
        DAILY: [
            { day: 1, type: 'coins', value: 100 },
            { day: 2, type: 'elo_boost', value: 1 },
            { day: 3, type: 'coins', value: 200 },
            { day: 4, type: 'avatar', value: 'exclusive_1' },
            { day: 5, type: 'coins', value: 500 },
            { day: 6, type: 'elo_boost', value: 3 },
            { day: 7, type: 'premium', value: 7 }
        ],
        
        BATTLE_PASS: {
            FREE: [
                { level: 1, reward: { type: 'coins', value: 50 } },
                { level: 5, reward: { type: 'avatar', value: 'free_1' } },
                { level: 10, reward: { type: 'coins', value: 200 } }
            ],
            PREMIUM: [
                { level: 1, reward: { type: 'coins', value: 200 } },
                { level: 5, reward: { type: 'avatar', value: 'premium_1' } },
                { level: 10, reward: { type: 'title', value: 'Kỳ Thủ' } }
            ]
        }
    },
    
    // Tournament Types
    TOURNAMENT_TYPES: {
        DAILY: {
            name: 'Giải Đấu Hằng Ngày',
            entryFee: 0,
            prizePool: 1000000,
            maxPlayers: 128,
            timeControl: 'blitz'
        },
        WEEKLY: {
            name: 'Giải Đấu Hằng Tuần',
            entryFee: 100,
            prizePool: 5000000,
            maxPlayers: 256,
            timeControl: 'rapid'
        },
        MONTHLY: {
            name: 'Giải Vô Địch Tháng',
            entryFee: 500,
            prizePool: 20000000,
            maxPlayers: 512,
            timeControl: 'classical'
        }
    },
    
    // Chat Commands
    CHAT_COMMANDS: {
        '/help': 'Hiển thị danh sách lệnh',
        '/stats': 'Xem thống kê',
        '/elo': 'Xem ELO hiện tại',
        '/friends': 'Xem danh sách bạn bè',
        '/challenge [username]': 'Thách đấu người chơi',
        '/resign': 'Đầu hàng',
        '/draw': 'Đề nghị hòa cờ'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}