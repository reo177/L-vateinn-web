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
        this.particles.forEach((particle, index) => {
            if (particle.elapsed >= 0) {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Update rotation
                particle.rotation += particle.rotationSpeed;
                
                // Reset if off screen
                if (particle.y < -100 || particle.x < -100 || particle.x > window.innerWidth + 100) {
                    particle.x = Math.random() * window.innerWidth;
                    particle.y = window.innerHeight + Math.random() * 200;
                    particle.elapsed = 0;
                    particle.rotation = Math.random() * 360;
                }
                
                // Update element position and rotation
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                particle.element.style.transform = `rotate(${particle.rotation}deg) scale(${1 + Math.sin(particle.elapsed * 0.1) * 0.2})`;
                
                // Dynamic glow effect
                const glowPulse = 0.7 + Math.sin(particle.elapsed * 0.5) * 0.3;
                particle.element.style.boxShadow = `0 0 ${15 * glowPulse}px rgba(255, 102, 102, ${glowPulse}), 0 0 ${30 * glowPulse}px rgba(255, 0, 0, ${glowPulse * 0.6})`;
                
                // Fade in/out with smooth transitions
                const progress = (particle.elapsed % particle.duration) / particle.duration;
                if (progress < 0.15) {
                    particle.element.style.opacity = particle.opacity * (progress / 0.15);
                } else if (progress > 0.85) {
                    particle.element.style.opacity = particle.opacity * ((1 - progress) / 0.15);
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
    
    // Create particle system with more particles for better effect
    const particleSystem = new ParticleSystem('particles-container', 80);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        particleSystem.resize();
    });
});

