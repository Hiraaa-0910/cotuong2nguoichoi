// ========== AUTHENTICATION SYSTEM ==========
class AuthenticationSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }
    
    init() {
        // For demo, simulate authentication
        setTimeout(() => {
            this.currentUser = {
                username: 'Guest',
                displayName: 'Khách',
                email: 'guest@example.com',
                elo: 1200
            };
            this.isAuthenticated = true;
            this.updateUI();
        }, 1000);
    }
    
    updateUI() {
        const userName = document.getElementById('userName');
        const userElo = document.getElementById('userElo');
        const loginBtn = document.getElementById('loginBtn');
        
        if (this.isAuthenticated && this.currentUser) {
            userName.textContent = this.currentUser.displayName;
            userElo.textContent = this.currentUser.elo;
            loginBtn.style.display = 'none';
        } else {
            userName.textContent = 'Khách';
            userElo.textContent = '1200';
            loginBtn.style.display = 'block';
        }
    }
    
    // UI Methods
    showLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
    }
    
    hideLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
    }
    
    showRegisterModal() {
        document.getElementById('registerModal').style.display = 'flex';
        this.hideLoginModal();
    }
    
    hideRegisterModal() {
        document.getElementById('registerModal').style.display = 'none';
    }
    
    // Profile modal methods
    showProfileModal() {
        if (!this.isAuthenticated || !this.currentUser) {
            this.showLoginModal();
            return;
        }
        this.populateProfileForm();
        document.getElementById('profileModal').style.display = 'flex';
    }

    hideProfileModal() {
        const el = document.getElementById('profileModal');
        if (el) el.style.display = 'none';
    }

    populateProfileForm() {
        if (!this.currentUser) return;
        const nameEl = document.getElementById('profileDisplayName');
        const emailEl = document.getElementById('profileEmail');
        const eloEl = document.getElementById('profileElo');
        if (nameEl) nameEl.value = this.currentUser.displayName || this.currentUser.username || '';
        if (emailEl) emailEl.value = this.currentUser.email || '';
        if (eloEl) eloEl.value = this.currentUser.elo || 1200;
    }

    saveProfile() {
        const nameEl = document.getElementById('profileDisplayName');
        const eloEl = document.getElementById('profileElo');
        if (!nameEl || !eloEl) return;

        const newName = nameEl.value.trim() || this.currentUser.displayName;
        const newElo = parseInt(eloEl.value, 10) || this.currentUser.elo || 1200;

        this.updateUserData({ displayName: newName, elo: newElo });
        toastr.success('Cập nhật hồ sơ thành công', 'Thành công');
        this.hideProfileModal();
    }
    
    showForgotPassword() {
        // Implement forgot password functionality
        toastr.info('Tính năng quên mật khẩu đang phát triển');
    }
}

// Create global instance
let authSystem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthenticationSystem();
    
    // Global functions for HTML onclick
    window.showLoginModal = () => authSystem.showLoginModal();
    window.hideLoginModal = () => authSystem.hideLoginModal();
    window.showRegisterModal = () => authSystem.showRegisterModal();
    window.hideRegisterModal = () => authSystem.hideRegisterModal();
    window.switchAccount = () => authSystem.switchAccount ? authSystem.switchAccount() : null;
    window.showUserProfile = () => authSystem.showProfileModal();
    window.hideProfileModal = () => authSystem.hideProfileModal();
    window.saveProfile = () => authSystem.saveProfile();
});