/**
 * Lævateinn Website - All JavaScript Combined
 * Optimized and unified
 */

(function() {
    'use strict';
    
    // ============================================
    // DATA (from JSON files)
    // ============================================
    const APP_DATA = {
        commands: {
            slash: [
                { name: "/externalraid", description: "外部荒らしを実行", danger: "high" },
                { name: "/stealthraid", description: "ステルス外部荒らしを実行", danger: "max" },
                { name: "/lævboot", description: "宣伝メッセージを送信", danger: "medium" },
                { name: "/spam", description: "カスタムメッセージスパム", danger: "medium" }
            ],
            prefix: [
                { name: "!Lævateinn", description: "フルレイド実行", danger: "max", emoji: "🔴 MAX" },
                { name: "!banall", description: "全員BAN", danger: "max", emoji: "🔴 MAX" },
                { name: "!massdm [message]", description: "全員にDM送信", danger: "high", emoji: "🟠 HIGH" },
                { name: "!purgeallmessages", description: "全メッセージ削除", danger: "high", emoji: "🟠 HIGH" },
                { name: "!renamechannels", description: "全チャンネル名変更", danger: "high", emoji: "🟠 HIGH" },
                { name: "!spamchannels [count]", description: "チャンネル大量作成", danger: "high", emoji: "🟠 HIGH" },
                { name: "!spamroles [count]", description: "ロール大量作成", danger: "high", emoji: "🟠 HIGH" },
                { name: "!nickall", description: "全員ニックネーム変更", danger: "high", emoji: "🟠 HIGH" }
            ]
        },
        features: {
            features: [
                {
                    name: "NUKE",
                    emoji: "💀",
                    items: [
                        "フルレイド実行",
                        "全員BAN",
                        "全メッセージ削除",
                        "チャンネル・ロール操作",
                        "ニックネーム変更"
                    ]
                },
                {
                    name: "RAID",
                    emoji: "🌐",
                    items: [
                        "外部ボット荒らし",
                        "APIフラッド攻撃",
                        "フォームスパム",
                        "DDoS攻撃",
                        "Webhook攻撃"
                    ]
                },
                {
                    name: "StealthRaid",
                    emoji: "🥷",
                    items: [
                        "高度な偽装",
                        "検出回避",
                        "ステルス外部荒らし",
                        "匿名性の向上"
                    ]
                }
            ]
        }
    };
    
    // ============================================
    // CORE INTERACTION FIX
    // ============================================
    function enableScroll() {
        const html = document.documentElement;
        const body = document.body;
        html.style.overflowY = 'auto';
        html.style.overflowX = 'hidden';
        body.style.overflowY = 'auto';
        body.style.overflowX = 'hidden';
    }
    
    function fixParticles() {
        const particles = document.getElementById('particles-container');
        if (particles) {
            particles.style.pointerEvents = 'none';
            particles.style.zIndex = '1';
        }
    }
    
    function fixCross() {
        const cross = document.querySelector('.inverted-cross');
        if (cross) {
            cross.style.pointerEvents = 'none';
            cross.style.zIndex = '0';
        }
    }
    
    function fixButtons() {
        const buttons = document.querySelectorAll('a.button, .button, a[href*="discord.com"]');
        buttons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '10001';
            btn.style.position = 'relative';
            const span = btn.querySelector('span');
            if (span) span.style.pointerEvents = 'none';
        });
        const headerButtons = document.querySelector('.header-buttons');
        if (headerButtons) {
            headerButtons.style.pointerEvents = 'auto';
            headerButtons.style.zIndex = '10000';
        }
    }
    
    function applyFixes() {
        enableScroll();
        fixParticles();
        fixCross();
        fixButtons();
    }
    
    // ============================================
    // INTERACTIVE FEATURES
    // ============================================
    let interactionsInitialized = false;
    
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1;
        `;
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(255, 0, 0, 0.5);
            z-index: 100000;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            animation: toastSlideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    function initInteractions() {
        if (interactionsInitialized) return;
        interactionsInitialized = true;
        
        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', (e) => createRipple(e, button), { passive: true });
        });
        
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => card.style.transform = '', 200);
            });
        });
        
        document.querySelectorAll('.command-item').forEach(item => {
            item.addEventListener('click', () => {
                const commandName = item.querySelector('.command-name');
                if (commandName) {
                    const command = commandName.textContent.trim();
                    navigator.clipboard.writeText(command).then(() => {
                        showToast(`Copied: ${command}`);
                    }).catch(() => {});
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (e.key === 'i' || e.key === 'I') {
                const inviteButton = document.querySelector('a[href*="discord.com"]');
                if (inviteButton) {
                    inviteButton.focus();
                    inviteButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
    
    // ============================================
    // MAIN APPLICATION
    // ============================================
    class MainApp {
        constructor() {
            this.data = APP_DATA;
            this.init();
        }
        
        init() {
            this.renderFeatures();
            this.renderCommands();
        }
        
        renderFeatures() {
            if (!this.data.features) return;
            const featureGrid = document.querySelector('.feature-grid');
            if (!featureGrid) return;
            featureGrid.innerHTML = '';
            this.data.features.features.forEach(feature => {
                const card = document.createElement('div');
                card.className = 'feature-card';
                const itemsHTML = feature.items.map(item => `<li>${item}</li>`).join('');
                card.innerHTML = `<h3>${feature.emoji} ${feature.name}</h3><ul>${itemsHTML}</ul>`;
                featureGrid.appendChild(card);
            });
        }
        
        renderCommands() {
            if (!this.data.commands) return;
            const commandLists = document.querySelectorAll('.command-list');
            if (commandLists.length < 2) return;
            
            const slashList = commandLists[0];
            if (this.data.commands.slash && this.data.commands.slash.length > 0) {
                slashList.innerHTML = '';
                this.data.commands.slash.forEach(cmd => {
                    const item = document.createElement('div');
                    item.className = 'command-item';
                    item.innerHTML = `<span class="command-name">${cmd.name}</span> - ${cmd.description}`;
                    slashList.appendChild(item);
                });
            }
            
            const prefixList = commandLists[1];
            if (this.data.commands.prefix && this.data.commands.prefix.length > 0) {
                prefixList.innerHTML = '';
                this.data.commands.prefix.forEach(cmd => {
                    const item = document.createElement('div');
                    item.className = 'command-item';
                    item.innerHTML = `<span class="command-name">${cmd.name}</span> - ${cmd.description} ${cmd.emoji || ''}`;
                    prefixList.appendChild(item);
                });
            }
        }
    }
    
    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    class ParticleSystem {
        constructor(containerId, particleCount = 15) {
            this.container = document.getElementById(containerId);
            this.particleCount = particleCount;
            this.particles = [];
            this.animationId = null;
            this.lastUpdate = 0;
            if (this.container) this.init();
        }
        
        init() {
            for (let i = 0; i < this.particleCount; i++) this.createParticle();
            this.animate();
        }
        
        createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight + Math.random() * 200;
            const size = 3 + Math.random() * 5;
            const opacity = 0.6 + Math.random() * 0.4;
            const glowIntensity = 0.5 + Math.random() * 0.5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = opacity;
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.boxShadow = `0 0 ${10 * glowIntensity}px rgba(255, 102, 102, ${glowIntensity}), 0 0 ${20 * glowIntensity}px rgba(255, 0, 0, ${glowIntensity * 0.5})`;
            const particleData = {
                element: particle,
                x: startX,
                y: startY,
                vx: (Math.random() - 0.5) * 0.8,
                vy: -0.8 - Math.random() * 0.7,
                opacity: opacity
            };
            this.particles.push(particleData);
            this.container.appendChild(particle);
        }
        
        animate() {
            const now = performance.now();
            if (!this.lastUpdate) this.lastUpdate = now;
            const delta = now - this.lastUpdate;
            if (delta >= 50) {
                const updates = [];
                this.particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    if (particle.y < -100 || particle.x < -100 || particle.x > window.innerWidth + 100) {
                        particle.x = Math.random() * window.innerWidth;
                        particle.y = window.innerHeight + Math.random() * 200;
                    }
                    updates.push({ element: particle.element, x: particle.x, y: particle.y });
                });
                updates.forEach(update => {
                    update.element.style.transform = `translate3d(${update.x}px, ${update.y}px, 0)`;
                });
                this.lastUpdate = now;
            }
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    function initParticles() {
        if (!document.getElementById('particles-container')) {
            const container = document.createElement('div');
            container.id = 'particles-container';
            document.body.appendChild(container);
        }
        const particleSystem = new ParticleSystem('particles-container', 15);
        window.addEventListener('resize', () => {
            particleSystem.particles.forEach(particle => {
                if (particle.x > window.innerWidth) particle.x = window.innerWidth;
                if (particle.y > window.innerHeight) particle.y = window.innerHeight;
            });
        });
    }
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    class ScrollAnimations {
        constructor() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            this.init();
        }
        
        init() {
            document.querySelectorAll('.section, .feature-card, .command-item').forEach(el => {
                this.observer.observe(el);
            });
        }
    }
    
    function initTextReveal() {
        const sectionTitles = document.querySelectorAll('.section-title, .subsection-title');
        sectionTitles.forEach(title => {
            const text = title.textContent;
            const words = text.split(' ');
            title.innerHTML = words.map((word, i) => 
                `<span class="word-reveal" style="display: inline-block; opacity: 0; animation: fadeInWord 0.8s ease forwards; animation-delay: ${(i + 1) * 0.1}s;">${word}</span>`
            ).join(' ');
        });
    }
    
    // ============================================
    // CSS INJECTION
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeInWord {
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        applyFixes();
        new MainApp();
        initParticles();
        new ScrollAnimations();
        initTextReveal();
        initInteractions();
    }
    
    // Run immediately
    applyFixes();
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            applyFixes();
        });
    } else {
        init();
        applyFixes();
    }
    
    // Run after delays
    setTimeout(applyFixes, 100);
    setTimeout(initInteractions, 500);
    window.addEventListener('load', applyFixes);
})();

