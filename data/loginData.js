// ========== LOGIN AND REGISTRATION SYSTEM ==========

class AuthenticationSystem {
    constructor() {
        this.loggedIn = false;
        this.username = null;
        this.elo = 1200;
        this.load();
    }

    load() {
        // Load user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            this.username = userData.username;
            this.elo = userData.elo;
            this.loggedIn = true;
        }
    }

    save() {
        // Save user data to localStorage
        const userData = {
            username: this.username,
            elo: this.elo
        };
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    login(username, password) {
        // For demo, accept any non-empty username/password
        if (username && password) {
            this.username = username;
            this.loggedIn = true;
            this.save();
            return true;
        }
        return false;
    }

    logout() {
        this.username = null;
        this.loggedIn = false;
        localStorage.removeItem('userData');
    }

    register(username, password) {
        // For demo, just log the data
        console.log('Registering user:', username, password);
        
        // In real implementation, send data to server
        return true;
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}

// Global instance
let authSystem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthenticationSystem();
    
    // Update UI based on login status
    if (authSystem.isLoggedIn()) {
        document.getElementById('userName').textContent = authSystem.username;
        document.getElementById('userElo').textContent = authSystem.elo;
        document.getElementById('loginBtn').style.display = 'none';
    } else {
        document.getElementById('userName').textContent = 'Khách';
        document.getElementById('userElo').textContent = '1200';
        document.getElementById('loginBtn').style.display = 'block';
    }
});

// Safe error display function
function showError(message) {
    try {
        if (typeof toastr !== 'undefined' && toastr.error) {
            toastr.error(message, 'Lỗi');
        } else {
            console.error(message);
            alert(message);
        }
    } catch (e) {
        console.error('Error displaying message:', message, e);
    }
}

function showSuccess(message) {
    try {
        if (typeof toastr !== 'undefined' && toastr.success) {
            toastr.success(message, 'Thành công');
        } else {
            console.log(message);
        }
    } catch (e) {
        console.error('Error displaying success:', message, e);
    }
}