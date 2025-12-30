/**
 * Fix interaction issues - ensure all elements are clickable and scrollable
 * Aggressive fix that runs multiple times to ensure it works
 */

(function() {
    'use strict';
    
    function fixInteractions() {
        const html = document.documentElement;
        const body = document.body;
        
        // CRITICAL: Force enable scrolling
        html.style.overflowY = 'auto';
        html.style.overflowX = 'hidden';
        html.style.height = 'auto';
        
        body.style.overflowY = 'auto';
        body.style.overflowX = 'hidden';
        body.style.height = 'auto';
        body.style.minHeight = '100vh';
        
        // Ensure particles don't block
        const particles = document.getElementById('particles-container');
        if (particles) {
            particles.style.pointerEvents = 'none';
            particles.style.zIndex = '1';
        }
        
        // Ensure cross doesn't block
        const cross = document.querySelector('.inverted-cross');
        if (cross) {
            cross.style.pointerEvents = 'none';
            cross.style.zIndex = '0';
        }
        
        // CRITICAL: Make invite button clickable - run every time
        const inviteButton = document.querySelector('a.button-primary, a[href*="discord.com"], .header-buttons a.button');
        if (inviteButton) {
            inviteButton.style.pointerEvents = 'auto';
            inviteButton.style.cursor = 'pointer';
            inviteButton.style.zIndex = '10001';
            inviteButton.style.position = 'relative';
            inviteButton.style.display = 'inline-block';
            
            // Remove onclick handler that might block
            inviteButton.onclick = null;
            
            // Ensure the span inside doesn't block clicks
            const span = inviteButton.querySelector('span');
            if (span) {
                span.style.pointerEvents = 'none';
            }
            
            // Force enable click by adding a direct handler
            inviteButton.addEventListener('click', function(e) {
                // Allow default behavior
                console.log('Invite button clicked!');
            }, { passive: true, capture: false });
        }
        
        // Ensure header-buttons container doesn't block
        const headerButtons = document.querySelector('.header-buttons');
        if (headerButtons) {
            headerButtons.style.pointerEvents = 'auto';
            headerButtons.style.zIndex = '10000';
            headerButtons.style.position = 'relative';
        }
        
        // Ensure all buttons are clickable
        const allButtons = document.querySelectorAll('a.button, .button');
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '10001';
            btn.style.position = 'relative';
        });
        
        // Check if scrolling is possible
        const canScroll = body.scrollHeight > window.innerHeight;
        if (canScroll && body.style.overflowY !== 'auto') {
            body.style.overflowY = 'auto';
            html.style.overflowY = 'auto';
        }
    }
    
    // Run immediately
    fixInteractions();
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixInteractions);
    } else {
        fixInteractions();
    }
    
    // Run multiple times to catch everything
    setTimeout(fixInteractions, 50);
    setTimeout(fixInteractions, 100);
    setTimeout(fixInteractions, 300);
    setTimeout(fixInteractions, 500);
    setTimeout(fixInteractions, 1000);
    
    window.addEventListener('load', fixInteractions);
    
    // Keep checking periodically
    setInterval(function() {
        const body = document.body;
        const html = document.documentElement;
        
        // Re-enable scroll if disabled
        if (body.style.overflowY === 'hidden' || html.style.overflowY === 'hidden') {
            fixInteractions();
        }
        
        // Re-enable button if disabled
        const btn = document.querySelector('a[href*="discord.com"]');
        if (btn) {
            const computed = window.getComputedStyle(btn);
            if (computed.pointerEvents === 'none') {
                fixInteractions();
            }
        }
    }, 2000);
    
    // Debug
    setTimeout(function() {
        const body = document.body;
        const html = document.documentElement;
        const btn = document.querySelector('a[href*="discord.com"]');
        
        console.log('=== DEBUG INFO ===');
        console.log('Body overflow-y:', window.getComputedStyle(body).overflowY);
        console.log('HTML overflow-y:', window.getComputedStyle(html).overflowY);
        console.log('Body scrollHeight:', body.scrollHeight);
        console.log('Window height:', window.innerHeight);
        console.log('Can scroll:', body.scrollHeight > window.innerHeight);
        
        if (btn) {
            console.log('Button found:', btn);
            console.log('Button pointer-events:', window.getComputedStyle(btn).pointerEvents);
            console.log('Button z-index:', window.getComputedStyle(btn).zIndex);
            console.log('Button href:', btn.href);
        } else {
            console.error('Button NOT FOUND!');
        }
    }, 2000);
})();
