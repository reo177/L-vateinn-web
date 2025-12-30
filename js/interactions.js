/**
 * Interactive Features
 * Button clicks, hover effects, etc.
 */

class Interactions {
    constructor() {
        this.init();
    }
    
    init() {
        this.initButtons();
        this.initCards();
        this.initCommands();
        this.initKeyboardShortcuts();
    }
    
    initButtons() {
        const buttons = document.querySelectorAll('.button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Ripple effect (don't prevent default for links)
                this.createRipple(e, button);
                
                // Don't prevent default - allow links to work normally
                // Analytics or tracking can be added here
            }, { passive: true });
        });
    }
    
    createRipple(event, element) {
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
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    initCards() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
            
            // Add click effect
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        });
    }
    
    initCommands() {
        const commandItems = document.querySelectorAll('.command-item');
        commandItems.forEach(item => {
            item.addEventListener('click', () => {
                // Copy command name to clipboard
                const commandName = item.querySelector('.command-name');
                if (commandName) {
                    const command = commandName.textContent.trim();
                    navigator.clipboard.writeText(command).then(() => {
                        // Show feedback
                        this.showToast(`Copied: ${command}`);
                    });
                }
            });
        });
    }
    
    showToast(message) {
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
            z-index: 10000;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            animation: toastSlideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC to reset scroll
            if (e.key === 'Escape') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // 'I' to focus invite button
            if (e.key === 'i' || e.key === 'I') {
                const inviteButton = document.querySelector('.button[href*="discord.com"]');
                if (inviteButton) {
                    inviteButton.focus();
                    inviteButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
}

// Add CSS for animations
const interactionStyle = document.createElement('style');
interactionStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes toastSlideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes toastSlideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(interactionStyle);

// Initialize on DOM ready (only once)
let interactionsInitialized = false;
document.addEventListener('DOMContentLoaded', () => {
    if (!interactionsInitialized) {
        new Interactions();
        interactionsInitialized = true;
    }
}, { once: true });

