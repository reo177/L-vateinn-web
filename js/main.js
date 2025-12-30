/**
 * Main JavaScript File
 * Loads data and initializes components
 */

class MainApp {
    constructor() {
        this.data = {
            commands: null,
            features: null
        };
        this.init();
    }
    
    async init() {
        try {
            // Load JSON data
            await this.loadData();
            
            // Render dynamic content
            this.renderFeatures();
            this.renderCommands();
            
            // Initialize other components
            this.initComponents();
        } catch (error) {
            // Error handling
        }
    }
    
    async loadData() {
        try {
            const [commandsRes, featuresRes] = await Promise.all([
                fetch('data/commands.json'),
                fetch('data/features.json')
            ]);
            
            this.data.commands = await commandsRes.json();
            this.data.features = await featuresRes.json();
        } catch (error) {
            // Fallback to static content
        }
    }
    
    renderFeatures() {
        if (!this.data.features) return;
        
        const featureGrid = document.querySelector('.feature-grid');
        if (!featureGrid) return;
        
        // Clear existing content
        featureGrid.innerHTML = '';
        
        this.data.features.features.forEach(feature => {
            const card = document.createElement('div');
            card.className = 'feature-card';
            
            const itemsHTML = feature.items.map(item => 
                `<li>${item}</li>`
            ).join('');
            
            card.innerHTML = `
                <h3>${feature.emoji} ${feature.name}</h3>
                <ul>${itemsHTML}</ul>
            `;
            
            featureGrid.appendChild(card);
        });
    }
    
    renderCommands() {
        if (!this.data.commands) return;
        
        const commandLists = document.querySelectorAll('.command-list');
        if (commandLists.length < 2) return;
        
        // Render slash commands
        const slashList = commandLists[0];
        slashList.innerHTML = '';
        this.data.commands.slash.forEach(cmd => {
            const item = document.createElement('div');
            item.className = 'command-item';
            item.innerHTML = `
                <span class="command-name">${cmd.name}</span> - ${cmd.description}
            `;
            slashList.appendChild(item);
        });
        
        // Render prefix commands
        const prefixList = commandLists[1];
        prefixList.innerHTML = '';
        this.data.commands.prefix.forEach(cmd => {
            const item = document.createElement('div');
            item.className = 'command-item';
            item.innerHTML = `
                <span class="command-name">${cmd.name}</span> - ${cmd.description} ${cmd.emoji || ''}
            `;
            prefixList.appendChild(item);
        });
    }
    
    initComponents() {
        // Initialize bot status and activity log
        this.initBotStatus();
    }
    
    initBotStatus() {
        // Initialize bot status display
        this.updateBotStatus();
        this.loadActivityLog();
        
        // Update status every 10 seconds for real-time updates
        setInterval(() => {
            this.loadActivityLog(); // This will also update status
        }, 10000);
    }
    
    async updateBotStatus() {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (!statusDot || !statusText) return;
        
        try {
            // Check bot status (simulated - replace with actual API call)
            const isOnline = await this.checkBotStatus();
            
            if (isOnline) {
                statusDot.classList.add('online');
                statusDot.classList.remove('offline');
                statusText.textContent = 'Bot Online';
            } else {
                statusDot.classList.remove('online');
                statusDot.classList.add('offline');
                statusText.textContent = 'Bot Offline';
            }
        } catch (error) {
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = 'Status Unknown';
        }
    }
    
    async checkBotStatus() {
        try {
            // Try to fetch from API endpoint
            const response = await fetch('https://www.lwa70d3.net/api/bot-status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.status === 'online';
            }
        } catch (error) {
            // If API fails, assume offline
        }
        
        return false;
    }
    
    async loadActivityLog() {
        const activityLog = document.getElementById('activityLog');
        if (!activityLog) return;
        
        try {
            // Fetch activity log from API
            const response = await fetch('https://www.lwa70d3.net/api/bot-logs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const data = await response.json();
                let logs = data.logs || [];
                
                // Webhookログがある場合は解析
                if (data.webhook_logs && Array.isArray(data.webhook_logs)) {
                    const parsedWebhookLogs = this.parseWebhookLogs(data.webhook_logs);
                    logs = [...logs, ...parsedWebhookLogs];
                }
                
                // タイムスタンプでソート（新しい順）
                logs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                
                this.renderActivityLog(logs);
                
                // 起動状態を更新
                this.updateStatusFromLogs(logs);
            } else {
                // Fallback to default log
                this.renderActivityLog(this.getDefaultLogs());
            }
        } catch (error) {
            // Fallback to default log on error
            this.renderActivityLog(this.getDefaultLogs());
        }
    }
    
    updateStatusFromLogs(logs) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (!statusDot || !statusText) return;
        
        // 最新のログから起動状態を判定
        const recentLogs = logs.slice(0, 10); // 最新10件を確認
        
        // 起動メッセージまたはReloadメッセージがあるか確認
        const hasStartup = recentLogs.some(log => 
            log.message && (log.message.includes('Bot started') || log.message.includes('heartbeat'))
        );
        
        // 最近5分以内にログがあるか確認
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const hasRecentActivity = recentLogs.some(log => 
            (log.timestamp || 0) > fiveMinutesAgo
        );
        
        if (hasStartup || hasRecentActivity) {
            statusDot.classList.add('online');
            statusDot.classList.remove('offline');
            statusText.textContent = 'Bot Online';
        } else {
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = 'Bot Offline';
        }
    }
    
    renderActivityLog(logs) {
        const activityLog = document.getElementById('activityLog');
        if (!activityLog) return;
        
        // Keep only last 20 entries
        const recentLogs = logs.slice(-20);
        
        activityLog.innerHTML = recentLogs.map(log => {
            const time = this.formatTime(log.timestamp || Date.now());
            const type = log.type || 'info';
            const message = this.sanitizeLogMessage(log.message || '');
            
            return `
                <div class="log-entry ${type}">
                    <span class="log-time">${time}</span>
                    <span class="log-message">${message}</span>
                </div>
            `;
        }).join('');
        
        // Auto-scroll to bottom
        activityLog.scrollTop = activityLog.scrollHeight;
    }
    
    getDefaultLogs() {
        const now = Date.now();
        return [
            {
                timestamp: now - 300000,
                type: 'info',
                message: 'Bot system initialized'
            },
            {
                timestamp: now - 240000,
                type: 'success',
                message: 'Discord API connection established'
            },
            {
                timestamp: now - 180000,
                type: 'info',
                message: 'Command handlers loaded successfully'
            },
            {
                timestamp: now - 120000,
                type: 'info',
                message: 'Monitoring server activity'
            },
            {
                timestamp: now - 60000,
                type: 'success',
                message: 'All systems operational'
            },
            {
                timestamp: now,
                type: 'info',
                message: 'Status check completed'
            }
        ];
    }
    
    parseWebhookLogs(logs) {
        // Webhookから取得したログを解析して表示用に変換
        const parsedLogs = [];
        
        logs.forEach(log => {
            const content = log.content || '';
            const timestamp = log.timestamp || Date.now();
            
            // 起動メッセージを検出
            if (content.includes('🚀 Lævateinn Bot Started') || content.includes('Bot Started')) {
                parsedLogs.push({
                    timestamp: timestamp,
                    type: 'success',
                    message: '🚀 Bot started successfully'
                });
            }
            // Reloadメッセージを検出（起動状態の確認）
            else if (content === 'Reload' || content.includes('Reload')) {
                parsedLogs.push({
                    timestamp: timestamp,
                    type: 'info',
                    message: '🔄 Bot heartbeat (online)'
                });
            }
            // コマンド実行を検出
            else if (content.includes('⚡ Command:') || content.includes('Command:')) {
                const commandMatch = content.match(/Command:\s*!?(\w+)/);
                const userMatch = content.match(/User:\s*([^\n]+)/);
                const serverMatch = content.match(/Server:\s*([^\n]+)/);
                
                let message = '⚡ Command executed';
                if (commandMatch) {
                    message = `⚡ Command: ${commandMatch[1]}`;
                }
                if (userMatch) {
                    message += ` | User: ${userMatch[1].split('(')[0].trim()}`;
                }
                if (serverMatch) {
                    message += ` | Server: ${serverMatch[1].split('(')[0].trim()}`;
                }
                
                parsedLogs.push({
                    timestamp: timestamp,
                    type: 'warning',
                    message: message
                });
            }
            // その他のメッセージ
            else if (content.trim()) {
                parsedLogs.push({
                    timestamp: timestamp,
                    type: 'info',
                    message: this.sanitizeLogMessage(content)
                });
            }
        });
        
        return parsedLogs;
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    sanitizeLogMessage(message) {
        // Sanitize log messages to prevent revealing sensitive information
        // Replace sensitive patterns with safe alternatives
        let sanitized = message
            .replace(/token[=:]\s*[\w-]+/gi, 'token: [REDACTED]')
            .replace(/webhook[=:]\s*https?:\/\/[^\s]+/gi, 'webhook: [REDACTED]')
            .replace(/discord\.com\/api\/webhooks\/[\w\/]+/gi, '[WEBHOOK_URL]')
            .replace(/MT[\w-]+/g, '[TOKEN]')
            .replace(/\d{17,19}/g, '[ID]'); // Discord IDs
        
        return sanitized;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});

