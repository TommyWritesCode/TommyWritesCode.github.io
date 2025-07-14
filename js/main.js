// Main JavaScript file for Tommy Nicol's Portfolio Website
// Handles mobile navigation, collapsible sections, and animations

(function() {
    'use strict';
    
    // DOM elements
    const body = document.body;
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Initialize the application
    function init() {
        setupSoundEffects();
        setupMobileNavigation();
        setupCollapsibleSections();
        setupScrollAnimations();
        setupSmoothScrolling();
        setupRetroEffects();
        setupCollapsingHeaders();
        setupPerformanceOptimizations();
    }
    
    // Sound Effects Setup
    function setupSoundEffects() {
        // Sound effects toggle (Ctrl+M shortcut)
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'm') {
                event.preventDefault();
                if (window.sfxManager) {
                    const isEnabled = window.sfxManager.toggle();
                    showNotification(isEnabled ? 'Sound effects enabled' : 'Sound effects disabled');
                }
            }
        });
    }
    
    // Mobile Navigation
    function setupMobileNavigation() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                const isActive = navMenu.classList.contains('active');
                
                if (isActive) {
                    closeMobileNav();
                } else {
                    openMobileNav();
                }
            });
            
            // Close mobile nav when clicking on a link
            const navLinks = navMenu.querySelectorAll('.nav__link');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMobileNav);
            });
            
            // Close mobile nav when clicking outside
            document.addEventListener('click', function(event) {
                if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                    closeMobileNav();
                }
            });
            
            // Close mobile nav on escape key
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closeMobileNav();
                }
            });
        }
    }
    
    function openMobileNav() {
        navMenu.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation menu');
        
        // Prevent body scroll when menu is open
        body.style.overflow = 'hidden';
    }
    
    function closeMobileNav() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        
        // Restore body scroll
        body.style.overflow = '';
    }
    
    // Collapsible Sections (for project thought processes)
    function setupCollapsibleSections() {
        const collapsibleTriggers = document.querySelectorAll('.collapsible__trigger');
        
        collapsibleTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const content = trigger.nextElementSibling;
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    collapseSection(trigger, content);
                } else {
                    expandSection(trigger, content);
                }
            });
        });
    }
    
    function expandSection(trigger, content) {
        trigger.setAttribute('aria-expanded', 'true');
        content.classList.add('expanded');
        
        // Set max-height to scrollHeight for smooth animation
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Update trigger text and icon
        const icon = trigger.querySelector('.collapsible__icon');
        if (icon) {
            icon.textContent = '×';
        }
    }
    
    function collapseSection(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
        content.classList.remove('expanded');
        content.style.maxHeight = '0';
        
        // Update trigger text and icon
        const icon = trigger.querySelector('.collapsible__icon');
        if (icon) {
            icon.textContent = '+';
        }
    }
    
    // Scroll Animations using Intersection Observer
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.preview__card, .project-card, .blog-card, .philosophy__card');
        
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            // Skip animations if user prefers reduced motion or browser doesn't support IntersectionObserver
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Set initial state and observe elements
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // Smooth Scrolling for anchor links
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                
                // Skip if it's just a hash
                if (href === '#') {
                    return;
                }
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    event.preventDefault();
                    
                    // Close mobile nav if open
                    closeMobileNav();
                    
                    // Smooth scroll to target
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update focus for accessibility
                    targetElement.focus();
                }
            });
        });
    }
    
    // Utility function to debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Header background change on scroll
    function setupHeaderScroll() {
        const header = document.querySelector('.header');
        
        if (!header) return;
        
        const scrollHandler = debounce(function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = '';
                header.style.backdropFilter = '';
            }
        }, 10);
        
        window.addEventListener('scroll', scrollHandler);
    }
    
    // Form validation and handling
    function setupFormHandling() {
        const contactForm = document.querySelector('.contact__form');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Create mailto link
            const mailtoLink = `mailto:tommy@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            alert('Thank you for your message! Your email client should open now.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Error handling for missing elements
    function handleErrors() {
        window.addEventListener('error', function(event) {
            console.error('JavaScript Error:', event.error);
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }
    
    // Performance optimization: lazy loading for images
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Additional setup after init
    document.addEventListener('DOMContentLoaded', function() {
        setupHeaderScroll();
        setupFormHandling();
        setupLazyLoading();
        handleErrors();
    });
    
    // Retro 90s Effects
    function setupRetroEffects() {
        // Add retro typing effect to nav logo
        setupTypingEffect();
        
        // Add glitch effects on hover
        setupGlitchEffects();
        
        // Add retro sound effects (if audio context is available)
        setupRetroSounds();
        
        // Add subtle interactive effects
        setupInteractiveEffects();
    }
    
    function setupTypingEffect() {
        const logo = document.querySelector('.nav__logo');
        if (!logo) return;
        
        const originalText = logo.textContent;
        const typingSpeed = 150;
        let currentIndex = 0;
        
        function typeText() {
            if (currentIndex <= originalText.length) {
                logo.textContent = originalText.slice(0, currentIndex) + '_';
                currentIndex++;
                setTimeout(typeText, typingSpeed);
            } else {
                // Remove cursor and restart after delay
                logo.textContent = originalText;
                setTimeout(() => {
                    currentIndex = 0;
                    typeText();
                }, 5000);
            }
        }
        
        // Start typing effect after page load
        setTimeout(typeText, 1000);
    }
    
    function setupInteractiveEffects() {
        // Add cursor trail effect
        setupCursorTrail();
        
        // Add hover sound effects to navigation
        addHoverSounds();
        
        // Add subtle screen flicker on load
        addScreenFlicker();
        
        // Add interactive terminal prompt
        addTerminalPrompt();
    }
    
    function setupCursorTrail() {
        let trail = [];
        const maxTrail = 10;
        
        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > maxTrail) {
                trail.shift();
            }
            
            // Remove old trails
            trail = trail.filter(point => Date.now() - point.time < 1000);
        });
        
        // Create subtle particle effect on click
        document.addEventListener('click', (e) => {
            createClickParticle(e.clientX, e.clientY);
        });
    }
    
    function createClickParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: var(--neon-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: particle-burst 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 600);
    }
    
    function addHoverSounds() {
        // Add subtle hover effects to buttons and links
        const interactiveElements = document.querySelectorAll('a, button, .nav__link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.textShadow = '0 0 8px currentColor';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.textShadow = '';
            });
        });
    }
    
    function addScreenFlicker() {
        // Add subtle screen flicker on page load
        const body = document.body;
        body.style.animation = 'screen-flicker 0.1s ease-in-out 3';
        
        setTimeout(() => {
            body.style.animation = '';
        }, 300);
    }
    
    function addTerminalPrompt() {
        // Add blinking cursor to form inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--neon-cyan)';
                input.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            });
        });
    }
    
    function setupGlitchEffects() {
        const cards = document.querySelectorAll('.preview__card, .project-card, .blog-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add temporary glitch class
                this.style.animation = 'glitch 0.3s ease-in-out';
                
                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            });
        });
        
        // Add glitch keyframes to a style element
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    function setupRetroSounds() {
        // Only add sounds if audio context is supported and user hasn't muted
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            function playBeep(frequency = 800, duration = 100, volume = 0.05) {
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + duration / 1000);
            }
            
            // Hover sounds for buttons and boxes (not clickable text)
            const hoverElements = document.querySelectorAll('.btn, .preview__card, .project-card, .blog-card, .badge-new, .badge-hot, .neon-border');
            hoverElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    playBeep(600, 30, 0.03);
                });
            });
            
            // Click sounds for ALL clickable elements (buttons, boxes, and text)
            const clickableElements = document.querySelectorAll('a, button, .btn, .preview__card, .project-card, .blog-card, .collapsible__trigger');
            clickableElements.forEach(element => {
                element.addEventListener('click', () => {
                    playBeep(1000, 80, 0.04);
                });
            });
            
        } catch (error) {
            console.log('Audio context not available:', error);
        }
    }
    
    // Enhanced Collapsing Headers Functionality
    function setupCollapsingHeaders() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        let ticking = false;
        let scrollDirection = 'up';
        
        function updateHeaders() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollThreshold = Math.min(windowHeight * 0.1, 80); // Dynamic threshold
            
            // Determine scroll direction
            if (scrollY > lastScrollY) {
                scrollDirection = 'down';
            } else if (scrollY < lastScrollY) {
                scrollDirection = 'up';
            }
            
            // Smooth header transition with optimized logic
            if (header) {
                // Use progressive scaling based on scroll position
                const scrollProgress = Math.min(scrollY / scrollThreshold, 1);
                
                if (scrollY > scrollThreshold) {
                    header.classList.add('scrolled');
                    
                    // Add smooth variable scaling based on scroll progress
                    const scaleMultiplier = 0.8 + (0.2 * (1 - Math.min(scrollProgress - 1, 0.5) / 0.5));
                    header.style.setProperty('--scale-factor', scaleMultiplier);
                } else {
                    header.classList.remove('scrolled');
                    header.style.removeProperty('--scale-factor');
                }
                
                // Add scroll direction class for potential future animations
                header.setAttribute('data-scroll-direction', scrollDirection);
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeaders);
                ticking = true;
            }
        }
        
        // Use passive listener for better performance
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Handle resize events
        window.addEventListener('resize', debounce(() => {
            updateHeaders();
        }, 250), { passive: true });
        
        // Initial call
        updateHeaders();
    }
    
    // Performance Optimizations
    function setupPerformanceOptimizations() {
        // Optimize Matrix Rain for performance
        optimizeMatrixRain();
        
        // Lazy load non-critical animations
        setupLazyAnimations();
        
        // Optimize scroll events
        optimizeScrollEvents();
    }
    
    function optimizeMatrixRain() {
        const matrixContainer = document.querySelector('.matrix-rain');
        if (!matrixContainer) return;
        
        // Reduce particles on mobile
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 20 : 30;
        
        // Clear existing particles
        matrixContainer.innerHTML = '';
        
        // Create optimized columns
        for (let i = 0; i < particleCount; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -100px;
                color: #00ff00;
                font-family: VT323, monospace;
                font-size: ${isMobile ? '10px' : '12px'};
                opacity: 0.2;
                pointer-events: none;
                white-space: pre;
                animation: matrix ${8 + Math.random() * 6}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            // Generate shorter text strings for performance
            const chars = '01';
            let columnText = '';
            for (let j = 0; j < 15; j++) {
                columnText += chars[Math.floor(Math.random() * chars.length)] + '\n';
            }
            column.textContent = columnText;
            
            matrixContainer.appendChild(column);
        }
    }
    
    function setupLazyAnimations() {
        // Only animate elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe cards and other animated elements
        const animatedElements = document.querySelectorAll('.project-card, .blog-card, .preview__card');
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }
    
    function optimizeScrollEvents() {
        // Debounce scroll-based animations
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            // Clear timeout if it exists
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            // Set new timeout
            scrollTimeout = setTimeout(() => {
                // Trigger any scroll-based optimizations here
                updateVisibility();
            }, 16); // ~60fps
        }, { passive: true });
    }
    
    function updateVisibility() {
        // Hide/show elements based on scroll position for performance
        const scrollY = window.scrollY;
        const matrixRain = document.querySelector('.matrix-rain');
        
        if (matrixRain) {
            // Reduce matrix opacity when scrolling fast
            const opacity = Math.max(0.1, 0.3 - (scrollY / 2000));
            matrixRain.style.opacity = opacity;
        }
    }
    
    // Show temporary notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-family: var(--font-mono);
            font-size: 14px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Add terminal-style console message
    function showTerminalWelcome() {
        console.log(`
████████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗   ██╗
╚══██╔══╝██╔═══██╗████╗ ████║████╗ ████║╚██╗ ██╔╝
   ██║   ██║   ██║██╔████╔██║██╔████╔██║ ╚████╔╝ 
   ██║   ██║   ██║██║╚██╔╝██║██║╚██╔╝██║  ╚██╔╝  
   ██║   ╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║   ██║   
   ╚═╝    ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝   ╚═╝   
                                                  
WELCOME TO THE CYBER REALM...
SYSTEM STATUS: OPTIMIZED
PERFORMANCE.MODE: ENGAGED
PHILOSOPHY.EXE: LOADED
COMP_SCI.DLL: INITIALIZED
        `);
        console.log('Type portfolioDebug to access developer functions');
    }
    
    // Expose some functions globally for debugging (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.portfolioDebug = {
            openMobileNav,
            closeMobileNav,
            expandSection,
            collapseSection,
            setupRetroEffects
        };
        showTerminalWelcome();
    }
    
})();