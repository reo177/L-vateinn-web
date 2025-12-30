/**
 * Particle System for Lævateinn Website
 * Creates animated particles in the background
 */

class ParticleSystem {
    constructor(containerId, particleCount = 50) {
        this.container = document.getElementById(containerId);
        this.particleCount = particleCount;
        this.particles = [];
        this.animationId = null;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
        
        // Start animation
        this.animate();
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + Math.random() * 200;
        
        // Random delay for staggered animation
        const delay = Math.random() * 10;
        
        // Random size variation (larger particles for better visibility)
        const size = 3 + Math.random() * 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random opacity (brighter)
        const opacity = 0.6 + Math.random() * 0.4;
        particle.style.opacity = opacity;
        
        // Random horizontal movement (more dynamic)
        const horizontalMovement = (Math.random() - 0.5) * 300;
        
        // Set initial position
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        // Random glow intensity
        const glowIntensity = 0.5 + Math.random() * 0.5;
        particle.style.boxShadow = `0 0 ${10 * glowIntensity}px rgba(255, 102, 102, ${glowIntensity}), 0 0 ${20 * glowIntensity}px rgba(255, 0, 0, ${glowIntensity * 0.5})`;
        
        // Store particle data
        const particleData = {
            element: particle,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.8 - Math.random() * 0.7,
            size: size,
            opacity: opacity,
            delay: delay,
            elapsed: -delay,
            duration: 10 + Math.random() * 10, // 10-20 seconds
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 5
        };
        
        this.particles.push(particleData);
        this.container.appendChild(particle);
    }
    
    animate() {
        // Throttle updates for better performance - reduced to 20fps
        const now = performance.now();
        if (!this.lastUpdate) this.lastUpdate = now;
        const delta = now - this.lastUpdate;
        
        // Update at ~20fps for much better performance
        if (delta >= 50) {
            // Batch DOM updates
            const updates = [];
            
            this.particles.forEach((particle, index) => {
                if (particle.elapsed >= 0) {
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Reset if off screen
                    if (particle.y < -100 || particle.x < -100 || particle.x > window.innerWidth + 100) {
                        particle.x = Math.random() * window.innerWidth;
                        particle.y = window.innerHeight + Math.random() * 200;
                        particle.elapsed = 0;
                    }
                    
                    // Store update for batch processing
                    updates.push({
                        element: particle.element,
                        x: particle.x,
                        y: particle.y,
                        opacity: particle.opacity
                    });
                }
                
                particle.elapsed += delta / 1000;
            });
            
            // Batch apply all DOM updates at once
            updates.forEach(update => {
                update.element.style.transform = `translate3d(${update.x}px, ${update.y}px, 0)`;
                update.element.style.opacity = update.opacity;
            });
            
            this.lastUpdate = now;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        // Handle window resize
        this.particles.forEach(particle => {
            if (particle.x > window.innerWidth) {
                particle.x = window.innerWidth;
            }
            if (particle.y > window.innerHeight) {
                particle.y = window.innerHeight;
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create particle container if it doesn't exist
    if (!document.getElementById('particles-container')) {
        const container = document.createElement('div');
        container.id = 'particles-container';
        document.body.appendChild(container);
    }
    
    // Create particle system with reduced particle count for better performance
    const particleSystem = new ParticleSystem('particles-container', 15);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        particleSystem.resize();
    });
});

