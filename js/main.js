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
        // Only render if JSON data is available, otherwise keep existing HTML
        if (!this.data.features) return;
        
        const featureGrid = document.querySelector('.feature-grid');
        if (!featureGrid) return;
        
        // Only clear if we have data to replace it with
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
        // Only render if JSON data is available, otherwise keep existing HTML
        if (!this.data.commands) return;
        
        const commandLists = document.querySelectorAll('.command-list');
        if (commandLists.length < 2) return;
        
        // Only clear if we have data to replace it with
        // Render slash commands
        const slashList = commandLists[0];
        if (this.data.commands.slash && this.data.commands.slash.length > 0) {
            slashList.innerHTML = '';
            this.data.commands.slash.forEach(cmd => {
                const item = document.createElement('div');
                item.className = 'command-item';
                item.innerHTML = `
                    <span class="command-name">${cmd.name}</span> - ${cmd.description}
                `;
                slashList.appendChild(item);
            });
        }
        
        // Render prefix commands
        const prefixList = commandLists[1];
        if (this.data.commands.prefix && this.data.commands.prefix.length > 0) {
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
    }
    
    initComponents() {
        // Components initialized - no API calls needed
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

