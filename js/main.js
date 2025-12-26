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
            console.error('Error initializing app:', error);
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
            console.error('Error loading data:', error);
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
        // Add any additional initialization here
        console.log('Lævateinn website initialized');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});

