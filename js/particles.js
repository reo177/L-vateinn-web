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
        const startY = window.innerHeight + Math.random() * 100;
        
        // Random delay for staggered animation
        const delay = Math.random() * 15;
        
        // Random size variation
        const size = 2 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random opacity
        const opacity = 0.4 + Math.random() * 0.6;
        particle.style.opacity = opacity;
        
        // Random horizontal movement
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        // Set initial position
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        // Create custom animation
        const animationDuration = 12 + Math.random() * 8; // 12-20 seconds
        particle.style.animation = `none`;
        
        // Store particle data
        const particleData = {
            element: particle,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.5 - Math.random() * 0.5,
            size: size,
            opacity: opacity,
            delay: delay,
            elapsed: -delay,
            duration: animationDuration
        };
        
        this.particles.push(particleData);
        this.container.appendChild(particle);
    }
    
    animate() {
        this.particles.forEach((particle, index) => {
            if (particle.elapsed >= 0) {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Reset if off screen
                if (particle.y < -50 || particle.x < -50 || particle.x > window.innerWidth + 50) {
                    particle.x = Math.random() * window.innerWidth;
                    particle.y = window.innerHeight + Math.random() * 100;
                    particle.elapsed = 0;
                }
                
                // Update element position
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                
                // Fade in/out
                const progress = (particle.elapsed % particle.duration) / particle.duration;
                if (progress < 0.1) {
                    particle.element.style.opacity = particle.opacity * (progress / 0.1);
                } else if (progress > 0.9) {
                    particle.element.style.opacity = particle.opacity * ((1 - progress) / 0.1);
                } else {
                    particle.element.style.opacity = particle.opacity;
                }
            }
            
            particle.elapsed += 0.016; // ~60fps
        });
        
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
    
    // Create particle system
    const particleSystem = new ParticleSystem('particles-container', 60);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        particleSystem.resize();
    });
});

