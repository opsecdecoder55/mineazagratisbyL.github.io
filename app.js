// ===== CashMiner Pro - Mining Simulation =====

class CashMiner {
    constructor() {
        // State
        this.totalBalance = 0;
        this.miningRate = 0.01; // Base $ per tick
        this.multiplier = 1.0;
        this.hashRate = 0;
        this.blocksFound = 0;
        this.efficiency = 0;
        this.progress = 0;
        this.sessionStart = Date.now();
        this.history = [];
        this.isBoostActive = false;

        // DOM Elements
        this.elements = {
            totalBalance: document.getElementById('totalBalance'),
            growthRate: document.getElementById('growthRate'),
            hashRate: document.getElementById('hashRate'),
            blocksFound: document.getElementById('blocksFound'),
            efficiency: document.getElementById('efficiency'),
            multiplier: document.getElementById('multiplier'),
            progressPercent: document.getElementById('progressPercent'),
            progressFill: document.getElementById('progressFill'),
            nextReward: document.getElementById('nextReward'),
            boostBtn: document.getElementById('boostBtn'),
            historyList: document.getElementById('historyList'),
            sessionTime: document.getElementById('sessionTime'),
            coinBurst: document.getElementById('coinBurst'),
            particles: document.getElementById('particles'),
            floatingDollars: document.getElementById('floatingDollars')
        };

        this.init();
    }

    init() {
        this.createParticles();
        this.createFloatingDollars();
        this.setupEventListeners();
        this.startMining();
        this.startAnimations();
    }

    // ===== Particle System =====
    createParticles() {
        const container = this.elements.particles;
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${5 + Math.random() * 5}s`;
            container.appendChild(particle);
        }
    }

    createFloatingDollars() {
        const container = this.elements.floatingDollars;
        const symbols = ['💵', '💰', '💲', '🤑', '$'];
        
        for (let i = 0; i < 15; i++) {
            const dollar = document.createElement('div');
            dollar.className = 'floating-dollar';
            dollar.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            dollar.style.left = `${Math.random() * 100}%`;
            dollar.style.animationDelay = `${Math.random() * 6}s`;
            dollar.style.animationDuration = `${4 + Math.random() * 4}s`;
            container.appendChild(dollar);
        }
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        this.elements.boostBtn.addEventListener('click', () => this.activateBoost());
        
        // Add click effect
        this.elements.boostBtn.addEventListener('mousedown', (e) => {
            this.elements.boostBtn.classList.add('clicked');
        });
        
        this.elements.boostBtn.addEventListener('mouseup', () => {
            setTimeout(() => {
                this.elements.boostBtn.classList.remove('clicked');
            }, 300);
        });

        // Touch support
        this.elements.boostBtn.addEventListener('touchstart', () => {
            this.elements.boostBtn.classList.add('clicked');
        });

        this.elements.boostBtn.addEventListener('touchend', () => {
            setTimeout(() => {
                this.elements.boostBtn.classList.remove('clicked');
            }, 300);
            this.activateBoost();
        });
    }

    // ===== Mining Logic =====
    startMining() {
        // Main mining tick - every 100ms
        setInterval(() => {
            this.miningTick();
        }, 100);

        // Update session time every second
        setInterval(() => {
            this.updateSessionTime();
        }, 1000);

        // Random bonus events
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 5 seconds
                this.triggerBonusEvent();
            }
        }, 5000);
    }

    miningTick() {
        // Calculate earnings
        const baseEarning = this.miningRate * this.multiplier;
        const randomBonus = Math.random() * 0.005;
        const earning = baseEarning + randomBonus;

        // Update balance
        this.totalBalance += earning;

        // Update hash rate (simulated)
        this.hashRate = Math.floor(150 + Math.random() * 50 + (this.isBoostActive ? 200 : 0));

        // Update efficiency
        this.efficiency = Math.min(100, 85 + Math.random() * 15);

        // Update progress
        this.progress += 0.5 + Math.random() * 0.5;
        if (this.progress >= 100) {
            this.completeBlock();
        }

        // Update UI
        this.updateUI();
    }

    completeBlock() {
        this.progress = 0;
        this.blocksFound++;
        
        // Calculate block reward
        const baseReward = 0.50 + Math.random() * 1.50;
        const reward = baseReward * this.multiplier;
        this.totalBalance += reward;

        // Add to history
        this.addToHistory(reward);

        // Create coin burst animation
        this.createCoinBurst();

        // Show money pop
        this.showMoneyPop(reward);

        // Increase multiplier slightly
        this.multiplier = Math.min(5.0, this.multiplier + 0.01);
    }

    createCoinBurst() {
        const container = this.elements.coinBurst;
        const coins = ['💵', '💰', '💲', '🤑'];
        
        for (let i = 0; i < 8; i++) {
            const coin = document.createElement('div');
            coin.className = 'burst-coin';
            coin.textContent = coins[Math.floor(Math.random() * coins.length)];
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            coin.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            coin.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            coin.style.left = '50%';
            coin.style.top = '50%';
            
            container.appendChild(coin);
            
            // Remove after animation
            setTimeout(() => {
                coin.remove();
            }, 1000);
        }
    }

    showMoneyPop(amount) {
        const pop = document.createElement('div');
        pop.className = 'money-pop';
        pop.textContent = `+$${amount.toFixed(2)}`;
        
        // Random position near center
        pop.style.left = `${40 + Math.random() * 20}%`;
        pop.style.top = `${30 + Math.random() * 10}%`;
        
        document.body.appendChild(pop);
        
        setTimeout(() => {
            pop.remove();
        }, 1500);
    }

    addToHistory(amount) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        
        this.history.unshift({
            amount: amount,
            time: timeStr
        });

        // Keep only last 10 items
        if (this.history.length > 10) {
            this.history.pop();
        }

        this.renderHistory();
    }

    renderHistory() {
        const container = this.elements.historyList;
        container.innerHTML = '';

        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.style.animationDelay = `${index * 0.05}s`;
            historyItem.innerHTML = `
                <span class="history-amount">+$${item.amount.toFixed(2)}</span>
                <span class="history-time">${item.time}</span>
            `;
            container.appendChild(historyItem);
        });
    }

    activateBoost() {
        if (this.isBoostActive) return;

        this.isBoostActive = true;
        this.multiplier *= 2;
        
        // Visual feedback
        this.elements.boostBtn.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)';
        this.elements.boostBtn.querySelector('.boost-text').textContent = 'BOOSTING!';

        // Create extra coin bursts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createCoinBurst(), i * 200);
        }

        // Boost duration - 5 seconds
        setTimeout(() => {
            this.isBoostActive = false;
            this.multiplier /= 2;
            this.elements.boostBtn.style.background = '';
            this.elements.boostBtn.querySelector('.boost-text').textContent = 'BOOST MINING';
        }, 5000);
    }

    triggerBonusEvent() {
        const bonusTypes = [
            { type: 'jackpot', amount: 5 + Math.random() * 10, message: '🎰 JACKPOT!' },
            { type: 'lucky', amount: 2 + Math.random() * 5, message: '🍀 LUCKY FIND!' },
            { type: 'bonus', amount: 1 + Math.random() * 3, message: '⭐ BONUS!' }
        ];

        const bonus = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        const reward = bonus.amount * this.multiplier;
        
        this.totalBalance += reward;
        this.addToHistory(reward);
        this.showMoneyPop(reward);
        this.createCoinBurst();
    }

    updateUI() {
        // Balance
        this.elements.totalBalance.textContent = this.formatNumber(this.totalBalance);
        
        // Growth rate
        const rate = this.miningRate * this.multiplier * 10; // Per second
        this.elements.growthRate.textContent = `+$${rate.toFixed(2)}/sec`;

        // Stats
        this.elements.hashRate.textContent = `${this.hashRate} MH/s`;
        this.elements.blocksFound.textContent = this.blocksFound.toString();
        this.elements.efficiency.textContent = `${this.efficiency.toFixed(1)}%`;
        this.elements.multiplier.textContent = `${this.multiplier.toFixed(1)}x`;

        // Progress
        this.elements.progressPercent.textContent = `${Math.floor(this.progress)}%`;
        this.elements.progressFill.style.width = `${this.progress}%`;

        // Next reward estimate
        const nextReward = (0.50 + Math.random() * 1.50) * this.multiplier;
        this.elements.nextReward.textContent = `$${nextReward.toFixed(2)}`;
    }

    updateSessionTime() {
        const elapsed = Date.now() - this.sessionStart;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        this.elements.sessionTime.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        }
        return num.toFixed(2);
    }

    startAnimations() {
        // Add subtle animations on interval
        setInterval(() => {
            // Randomly spawn extra floating dollars
            if (Math.random() < 0.3) {
                this.spawnExtraDollar();
            }
        }, 2000);
    }

    spawnExtraDollar() {
        const container = this.elements.floatingDollars;
        const symbols = ['💵', '💰', '💲', '🤑', '$', '💸'];
        
        const dollar = document.createElement('div');
        dollar.className = 'floating-dollar';
        dollar.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        dollar.style.left = `${Math.random() * 100}%`;
        dollar.style.animationDuration = `${3 + Math.random() * 3}s`;
        container.appendChild(dollar);

        // Remove after animation
        setTimeout(() => {
            dollar.remove();
        }, 6000);
    }
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    new CashMiner();
});

// ===== Service Worker Registration (for offline support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Optional: Register service worker for PWA support
        // navigator.serviceWorker.register('/sw.js');
    });
}
