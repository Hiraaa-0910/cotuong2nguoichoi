// ========== VISUAL EFFECTS SYSTEM ==========
class GameEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupParticleSystem();
        this.setupAnimations();
        this.setupSoundSystem();
    }

    setupParticleSystem() {
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.id = 'particleCanvas';
        this.particleCanvas.style.position = 'fixed';
        this.particleCanvas.style.top = '0';
        this.particleCanvas.style.left = '0';
        this.particleCanvas.style.width = '100%';
        this.particleCanvas.style.height = '100%';
        this.particleCanvas.style.pointerEvents = 'none';
        this.particleCanvas.style.zIndex = '100';
        document.body.appendChild(this.particleCanvas);

        this.ctx = this.particleCanvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
        this.startAnimation();
    }

    resizeCanvas() {
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
    }

    startAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
            this.updateParticles();
            this.drawParticles();
            requestAnimationFrame(animate);
        };
        animate();
    }

    createParticles(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 6 - 3,
                speedY: Math.random() * 6 - 3,
                color: color,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;
    }

    setupAnimations() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pieceCapture {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(0.5); opacity: 0; }
            }
            
            @keyframes piecePromote {
                0% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.3); filter: brightness(1.5); }
                100% { transform: scale(1); filter: brightness(1); }
            }
            
            @keyframes checkWarning {
                0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); }
                50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); }
            }
            
            @keyframes victoryFireworks {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .capture-animation {
                animation: pieceCapture 0.5s ease-out forwards;
            }
            
            .promote-animation {
                animation: piecePromote 0.6s ease-in-out;
            }
            
            .check-animation {
                animation: checkWarning 1s infinite;
            }
            
            .victory-firework {
                position: absolute;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                pointer-events: none;
                animation: victoryFireworks 1s ease-out forwards;
            }
            
            .pulse-effect {
                animation: pulse 0.5s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    setupSoundSystem() {
        this.audioContext = null;
        this.soundEnabled = true;
        
        // Initialize audio context on user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }

    // Visual Effects
    showCaptureEffect(x, y, color) {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            const piece = cell.querySelector('.piece');
            if (piece) {
                piece.classList.add('capture-animation');
                setTimeout(() => {
                    piece.classList.remove('capture-animation');
                }, 500);
            }
            
            // Particle effect
            const rect = cell.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            this.createParticles(centerX, centerY, color === 'red' ? '#FF0000' : '#000000', 30);
        }
    }

    showMoveEffect(fromX, fromY, toX, toY) {
        const fromCell = document.querySelector(`.cell[data-x="${fromX}"][data-y="${fromY}"]`);
        const toCell = document.querySelector(`.cell[data-x="${toX}"][data-y="${toY}"]`);
        
        if (fromCell && toCell) {
            // Create move trail
            const fromRect = fromCell.getBoundingClientRect();
            const toRect = toCell.getBoundingClientRect();
            
            const startX = fromRect.left + fromRect.width / 2;
            const startY = fromRect.top + fromRect.height / 2;
            const endX = toRect.left + toRect.width / 2;
            const endY = toRect.top + toRect.height / 2;
            
            // Create particles along the path
            const steps = 10;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t;
                this.createParticles(x, y, '#FFD700', 3);
            }
        }
    }

    showCheckEffect(kingX, kingY) {
        const cell = document.querySelector(`.cell[data-x="${kingX}"][data-y="${kingY}"]`);
        if (cell) {
            cell.classList.add('check-animation');
            setTimeout(() => {
                cell.classList.remove('check-animation');
            }, 3000);
            
            // Flash particles
            const rect = cell.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            this.createParticles(centerX, centerY, '#FF0000', 50);
        }
    }

    showPromotionEffect(x, y) {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            const piece = cell.querySelector('.piece');
            if (piece) {
                piece.classList.add('promote-animation');
                setTimeout(() => {
                    piece.classList.remove('promote-animation');
                }, 600);
            }
            
            // Sparkle effect
            const rect = cell.getBoundingClientRect();
            for (let i = 0; i < 20; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'victory-firework';
                sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
                sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;
                sparkle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }
        }
    }

    showVictoryEffect(winner) {
        const colors = winner === 'red' ? ['#FF0000', '#FF6B6B', '#FF4757'] : ['#000000', '#2C3E50', '#34495E'];
        
        // Fireworks
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = window.innerHeight;
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Create firework burst
                for (let j = 0; j < 30; j++) {
                    setTimeout(() => {
                        this.createParticles(x, y, color, 10);
                    }, j * 10);
                }
            }, i * 100);
        }
        
        // Confetti
        this.createConfetti(colors);
    }

    createConfetti(colors) {
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = `${Math.random() * window.innerWidth}px`;
            confetti.style.top = '-10px';
            confetti.style.opacity = '0.8';
            confetti.style.zIndex = '9999';
            document.body.appendChild(confetti);
            
            // Animate
            const animation = confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 0.8 },
                { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }

    // Sound Effects
    playSound(type, options = {}) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        let frequency = 440;
        let duration = 0.2;
        let volume = 0.1;
        
        switch(type) {
            case 'move':
                frequency = 523.25; // C5
                break;
            case 'capture':
                frequency = 659.25; // E5
                duration = 0.3;
                volume = 0.15;
                break;
            case 'check':
                frequency = 783.99; // G5
                duration = 0.4;
                break;
            case 'checkmate':
                frequency = 1046.50; // C6
                duration = 0.6;
                volume = 0.2;
                break;
            case 'promote':
                frequency = 880.00; // A5
                duration = 0.5;
                break;
            case 'victory':
                // Victory fanfare
                this.playVictoryFanfare();
                return;
        }
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playVictoryFanfare() {
        const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51];
        const noteDuration = 0.2;
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noteDuration);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + noteDuration);
            }, index * 250);
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    // UI Effects
    highlightValidMoves(moves) {
        // Remove previous highlights
        document.querySelectorAll('.valid-move-highlight').forEach(el => el.remove());
        
        // Add new highlights
        moves.forEach(move => {
            const cell = document.querySelector(`.cell[data-x="${move.x}"][data-y="${move.y}"]`);
            if (cell) {
                const highlight = document.createElement('div');
                highlight.className = 'valid-move-highlight';
                highlight.style.position = 'absolute';
                highlight.style.width = '20px';
                highlight.style.height = '20px';
                highlight.style.background = 'rgba(0, 255, 0, 0.5)';
                highlight.style.borderRadius = '50%';
                highlight.style.top = '50%';
                highlight.style.left = '50%';
                highlight.style.transform = 'translate(-50%, -50%)';
                highlight.style.zIndex = '1';
                cell.appendChild(highlight);
            }
        });
    }

    clearHighlights() {
        document.querySelectorAll('.valid-move-highlight').forEach(el => el.remove());
    }

    shakeBoard() {
        const board = document.getElementById('chessBoard');
        if (board) {
            board.style.animation = 'none';
            setTimeout(() => {
                board.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    board.style.animation = '';
                }, 500);
            }, 10);
        }
    }

    pulseElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('pulse-effect');
            setTimeout(() => {
                element.classList.remove('pulse-effect');
            }, 1000);
        }
    }

    showFloatingText(text, x, y, color = '#FFD700') {
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.position = 'fixed';
        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;
        floatingText.style.color = color;
        floatingText.style.fontWeight = 'bold';
        floatingText.style.fontSize = '1.2rem';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '1000';
        floatingText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        floatingText.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(floatingText);
        
        // Animate
        floatingText.animate([
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -100px) scale(1.5)' }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            floatingText.remove();
        }, 1000);
    }
}