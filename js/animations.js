/**
 * Advanced Animations and Interactions
 * for Lævateinn Website
 */

// Intersection Observer for scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        this.init();
    }
    
    init() {
        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            this.observer.observe(section);
        });
        
        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            this.observer.observe(card);
        });
        
        // Observe command items
        document.querySelectorAll('.command-item').forEach(item => {
            this.observer.observe(item);
        });
    }
}

// Mouse tracking effects
class MouseEffects {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateParallax();
        });
        
        // Add cursor glow effect
        this.createCursorGlow();
    }
    
    updateParallax() {
        // Subtle parallax effect on sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const distance = (this.mouseY - centerY) / window.innerHeight;
            const parallax = distance * 10;
            section.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    createCursorGlow() {
        // Create cursor glow effect
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(glow);
        
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mouseenter', () => {
            glow.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    }
}

// Text reveal animations
class TextReveal {
    constructor() {
        this.init();
    }
    
    init() {
        const titles = document.querySelectorAll('.section-title, .logo, .subtitle');
        titles.forEach(title => {
            this.splitText(title);
        });
    }
    
    splitText(element) {
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = words.map(word => 
            `<span class="word-reveal" style="display: inline-block; opacity: 0; animation: fadeInWord 0.8s ease forwards;">
                ${word}
            </span>`
        ).join(' ');
    }
}

// Add CSS for word reveal animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInWord {
        to {
            opacity: 1;
        }
    }
    
    .word-reveal:nth-child(1) { animation-delay: 0.1s; }
    .word-reveal:nth-child(2) { animation-delay: 0.2s; }
    .word-reveal:nth-child(3) { animation-delay: 0.3s; }
    .word-reveal:nth-child(4) { animation-delay: 0.4s; }
    .word-reveal:nth-child(5) { animation-delay: 0.5s; }
    .word-reveal:nth-child(6) { animation-delay: 0.6s; }
    .word-reveal:nth-child(7) { animation-delay: 0.7s; }
    .word-reveal:nth-child(8) { animation-delay: 0.8s; }
    .word-reveal:nth-child(9) { animation-delay: 0.9s; }
    .word-reveal:nth-child(10) { animation-delay: 1.0s; }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new MouseEffects();
    // Text reveal for section titles (not logo to keep gradient effect)
    const sectionTitles = document.querySelectorAll('.section-title, .subsection-title');
    sectionTitles.forEach(title => {
        const textReveal = new TextReveal();
        textReveal.splitText(title);
    });
});

