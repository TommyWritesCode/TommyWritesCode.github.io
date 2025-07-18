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
        setupVisitorCounter();
        setupLaserEffects();
        setupTechnoEasterEggs();
        setupEnhancedInteractions();
        setupLogoTyping();
        setupClickableCards();
        setupDownloadButton();
        setupEnhancedBackgroundEffects();
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
    
    /**
     * Professional Navigation System
     * Handles mobile navigation with robust state management
     */
    
    // Navigation state management
    let isNavActive = false;
    let animationInProgress = false;
    let resizeTimeout;
    let scrollPosition = 0;
    
    function setupMobileNavigation() {
        if (!navToggle || !navMenu) return;
        
        // Get navigation elements
        const navClose = document.getElementById('nav-close');
        const navLinks = navMenu.querySelectorAll('.nav__link');
        const footer = document.querySelector('.footer');
        
        // Initialize ARIA attributes and states
        initializeNavigationState();
        
        // Event listeners
        navToggle.addEventListener('click', handleToggleClick);
        if (navClose) {
            navClose.addEventListener('click', handleCloseClick);
        }
        
        // Close navigation when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });
        
        // Close navigation when clicking outside
        document.addEventListener('click', handleOutsideClick);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
        
        // Window resize and orientation change handling
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Persistent positioning on scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial state setup - ensure clean state on page load
        initializeNavigationState();
        handleResize();
    }
    
    /**
     * Initialize navigation state and ARIA attributes
     */
    function initializeNavigationState() {
        // Force reset all state variables
        isNavActive = false;
        animationInProgress = false;
        
        // Set proper ARIA attributes
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        navToggle.setAttribute('aria-controls', 'nav-menu');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Remove all navigation classes
        navMenu.classList.remove('nav-active', 'nav-expanded');
        navToggle.classList.remove('nav-toggle-active');
        document.body.classList.remove('nav-active');
        
        // Clear any inline styles
        navMenu.style.position = '';
        navMenu.style.bottom = '';
        navMenu.style.left = '';
        navMenu.style.right = '';
        navMenu.style.zIndex = '';
        
        // Ensure footer is visible
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.classList.remove('footer-hidden');
        }
        
        // Set initial state based on screen size
        if (window.innerWidth <= 768) {
            navMenu.classList.add('nav-hidden');
        } else {
            // Ensure desktop navigation is fully accessible
            navMenu.setAttribute('aria-hidden', 'false');
        }
    }
    
    /**
     * Handle hamburger toggle button click
     */
    function handleToggleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (animationInProgress) return;
        
        if (isNavActive) {
            deactivateNavigation();
        } else {
            activateNavigation();
        }
    }
    
    /**
     * Handle close button click
     */
    function handleCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (animationInProgress) return;
        
        deactivateNavigation();
    }
    
    /**
     * Handle navigation link clicks
     */
    function handleLinkClick() {
        if (isNavActive && window.innerWidth <= 768) {
            deactivateNavigation();
        }
    }
    
    /**
     * Handle clicks outside navigation
     */
    function handleOutsideClick(event) {
        if (isNavActive && 
            !navToggle.contains(event.target) && 
            !navMenu.contains(event.target)) {
            deactivateNavigation();
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    function handleKeydown(event) {
        if (event.key === 'Escape' && isNavActive) {
            deactivateNavigation();
            navToggle.focus();
        }
    }
    
    /**
     * Activate navigation - show menu and lock to bottom
     */
    function activateNavigation() {
        if (isNavActive || animationInProgress) return;
        
        animationInProgress = true;
        isNavActive = true;
        
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation menu');
        navMenu.setAttribute('aria-hidden', 'false');
        
        // Update CSS classes for smooth animation
        navMenu.classList.remove('nav-hidden');
        navMenu.classList.add('nav-active');
        navToggle.classList.add('nav-toggle-active');
        
        // Handle footer visibility on mobile (but allow scrolling)
        if (window.innerWidth <= 768) {
            handleMobileActivation();
        }
        
        // Enforce bottom positioning
        enforceBottomPositioning();
        
        // Focus management for accessibility
        setTimeout(() => {
            const firstLink = navMenu.querySelector('.nav__link');
            if (firstLink) {
                firstLink.focus();
            }
            animationInProgress = false;
        }, 300);
    }
    
    /**
     * Handle mobile-specific activation logic
     */
    function handleMobileActivation() {
        const footer = document.querySelector('.footer');
        
        // Hide footer to prevent conflicts
        if (footer) {
            footer.classList.add('footer-hidden');
        }
        
        // Add body class for navigation active state (allows scrolling)
        document.body.classList.add('nav-active');
    }
    
    /**
     * Deactivate navigation - hide menu and restore normal state
     */
    function deactivateNavigation() {
        if (!isNavActive || animationInProgress) return;
        
        animationInProgress = true;
        isNavActive = false;
        
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Update CSS classes for smooth animation
        navMenu.classList.remove('nav-active');
        navMenu.classList.add('nav-hidden');
        navToggle.classList.remove('nav-toggle-active');
        
        // Handle mobile deactivation
        if (window.innerWidth <= 768) {
            handleMobileDeactivation();
        }
        
        // Complete animation
        setTimeout(() => {
            animationInProgress = false;
        }, 300);
    }
    
    /**
     * Handle mobile-specific deactivation logic
     */
    function handleMobileDeactivation() {
        const footer = document.querySelector('.footer');
        
        // Restore footer visibility
        if (footer) {
            footer.classList.remove('footer-hidden');
        }
        
        // Remove body class for navigation active state
        document.body.classList.remove('nav-active');
    }
    
    /**
     * Handle window resize events with debouncing
     */
    function handleResize() {
        clearTimeout(resizeTimeout);
        
        // Immediate response for critical layout changes
        const isDesktop = window.innerWidth > 768;
        const wasDesktop = !navToggle.classList.contains('nav-toggle-active');
        
        // Add smooth transition class during resize
        document.body.classList.add('resizing');
        
        // Debounced resize logic for non-critical updates
        resizeTimeout = setTimeout(() => {
            if (isDesktop) {
                handleDesktopResize();
            } else {
                handleMobileResize();
            }
            
            // Optimize animations and content during resize
            optimizeContentDuringResize();
            
            // Remove resize class after transitions complete
            setTimeout(() => {
                document.body.classList.remove('resizing');
            }, 300);
        }, 100); // Faster response time for better UX
    }
    
    /**
     * Handle desktop resize logic
     */
    function handleDesktopResize() {
        // Force reset navigation state for desktop
        isNavActive = false;
        animationInProgress = false;
        
        // Clean up all mobile-specific states
        navMenu.classList.remove('nav-active', 'nav-hidden', 'nav-expanded');
        navToggle.classList.remove('nav-toggle-active');
        document.body.classList.remove('nav-active');
        
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.classList.remove('footer-hidden');
        }
        
        // Reset ARIA attributes and ensure proper desktop state
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Clear any inline styles that might persist
        navMenu.style.position = '';
        navMenu.style.bottom = '';
        navMenu.style.left = '';
        navMenu.style.right = '';
        navMenu.style.zIndex = '';
        
        // Ensure body is not in any locked state
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
    }
    
    /**
     * Handle mobile resize logic
     */
    function handleMobileResize() {
        if (isNavActive) {
            // Maintain bottom positioning during resize
            enforceBottomPositioning();
        }
    }
    
    /**
     * Handle orientation change events
     */
    function handleOrientationChange() {
        setTimeout(() => {
            if (isNavActive && window.innerWidth <= 768) {
                enforceBottomPositioning();
            }
        }, 100);
    }
    
    /**
     * Handle scroll events - maintain bottom positioning
     */
    function handleScroll() {
        if (isNavActive && window.innerWidth <= 768) {
            enforceBottomPositioning();
        }
    }
    
    /**
     * Enforce bottom positioning - ensure navigation stays anchored
     */
    function enforceBottomPositioning() {
        if (isNavActive && window.innerWidth <= 768) {
            navMenu.style.position = 'fixed';
            navMenu.style.bottom = '0';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.zIndex = '9999';
        }
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
    
    // Enhanced Scroll Animations with Staggered Reveals
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.preview__card, .project-card, .blog-card, .philosophy__card, .about__heading, .preview__title, .retro-table-cell');
        
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            // Skip animations if user prefers reduced motion or browser doesn't support IntersectionObserver
            return;
        }
        
        const observerOptions = {
            threshold: 0.05,  // Trigger much earlier
            rootMargin: '100px 0px 50px 0px'  // Start animation 100px before element is visible
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Much faster staggered animation delay
                    const delay = index * 20;  // Reduced from 100ms to 20ms
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        
                        // Add laser burst effect for cards (but faster)
                        if (entry.target.classList.contains('preview__card') || 
                            entry.target.classList.contains('project-card') || 
                            entry.target.classList.contains('blog-card')) {
                            addRevealEffect(entry.target);
                        }
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Set initial state and observe elements
        animatedElements.forEach((element, index) => {
            element.classList.add('animate-prepare');
            observer.observe(element);
        });
    }
    
    function addRevealEffect(element) {
        // Create a brief glow effect when element appears - much faster
        const originalBoxShadow = element.style.boxShadow;
        element.style.boxShadow = originalBoxShadow + ', 0 0 20px rgba(0, 255, 255, 0.6)';
        
        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
        }, 300);  // Reduced from 600ms to 300ms
        
        // Add corner laser effects - much faster
        const corners = element.querySelectorAll('.laser-corner');
        corners.forEach((corner, i) => {
            setTimeout(() => {
                corner.style.opacity = '1';
                corner.style.animation = 'laser-corner-reveal 0.2s ease-out';  // Reduced from 0.4s to 0.2s
                setTimeout(() => {
                    corner.style.opacity = '0';
                    corner.style.animation = '';
                }, 200);  // Reduced from 400ms to 200ms
            }, i * 30);  // Reduced from 100ms to 30ms
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
    
    // Site Visit Tracking - runs on every page
    function trackSiteVisit() {
        // Check if this is a new session
        const lastVisit = localStorage.getItem('lastVisitTime');
        const currentTime = Date.now();
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        const isNewSession = !lastVisit || (currentTime - parseInt(lastVisit)) > sessionTimeout;
        
        if (isNewSession) {
            // Increment visitor count for new session
            let currentCount = parseInt(localStorage.getItem('visitorCount'));
            
            // If no stored count, use page-specific fallback
            if (!currentCount || currentCount === 0) {
                const path = window.location.pathname;
                if (path.includes('contact.html')) {
                    currentCount = 512; // Contact page fallback
                } else if (path.includes('about.html')) {
                    currentCount = 256; // About page fallback  
                } else if (path.includes('blog.html')) {
                    currentCount = 128; // Blog page fallback
                } else if (path.includes('projects.html')) {
                    currentCount = 1024; // Projects page fallback
                } else {
                    currentCount = 1337; // Homepage fallback
                }
            }
            
            const newCount = currentCount + 1;
            localStorage.setItem('visitorCount', newCount);
            localStorage.setItem('lastVisitTime', currentTime.toString());
            
            // Try to sync with API in background
            syncWithAPI();
        }
        
        // Update counter display if element exists (homepage)
        const counterElement = document.getElementById('visitor-count');
        if (counterElement) {
            displayVisitorCount(counterElement, isNewSession);
        }
    }
    
    // Display visitor counter (works on any page with counter element)
    function displayVisitorCount(counterElement, isNewSession) {
        let currentCount = parseInt(localStorage.getItem('visitorCount'));
        
        // If no stored count, use page-specific fallback
        if (!currentCount || currentCount === 0) {
            // Get page-specific fallback based on current page
            const path = window.location.pathname;
            if (path.includes('contact.html')) {
                currentCount = 512; // Contact page fallback
            } else if (path.includes('about.html')) {
                currentCount = 256; // About page fallback  
            } else if (path.includes('blog.html')) {
                currentCount = 128; // Blog page fallback
            } else if (path.includes('projects.html')) {
                currentCount = 1024; // Projects page fallback
            } else {
                currentCount = 1337; // Homepage fallback
            }
            // Store the fallback so it persists
            localStorage.setItem('visitorCount', currentCount);
        }
        
        // Display current count immediately
        const formatted = currentCount.toString().padStart(4, '0');
        counterElement.textContent = formatted;
        
        // If this was a new session, show increment animation
        if (isNewSession) {
            setTimeout(() => {
                addIncrementVisualCue(counterElement);
            }, 1000); // Show animation after 1 second
        }
    }
    
    // Legacy function name for compatibility
    function setupVisitorCounter() {
        trackSiteVisit();
    }
    
    // Visual cue for counter increment (only when counter element exists)
    function showCounterIncrement(element) {
        const currentCount = parseInt(localStorage.getItem('visitorCount')) || 0;
        const formatted = currentCount.toString().padStart(4, '0');
        element.textContent = formatted;
        
        // Add a brief glow effect when number changes
        element.style.animation = 'count-increment 0.6s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
    
    function addIncrementVisualCue(element) {
        // Create a small visual indicator
        const indicator = document.createElement('span');
        indicator.textContent = '+1';
        indicator.style.cssText = `
            position: absolute;
            color: var(--neon-yellow);
            font-family: var(--font-pixel);
            font-size: 8px;
            font-weight: bold;
            text-shadow: 0 0 5px currentColor;
            animation: increment-cue 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Position it near the counter
        const rect = element.getBoundingClientRect();
        indicator.style.left = (rect.right + 5) + 'px';
        indicator.style.top = (rect.top - 5) + 'px';
        
        document.body.appendChild(indicator);
        
        // Remove after animation
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 800);
        
        // Also add a brief flash to the counter itself
        element.style.animation = 'counter-flash 0.3s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }
    
    function syncWithAPI() {
        // Try to fetch from an actual API service (optional)
        fetch('https://api.countapi.xyz/get/tommynicol.github.io/visits')
            .then(response => response.json())
            .then(data => {
                if (data.value && data.value > 0) {
                    // Update localStorage with API value if it's higher
                    const localCount = parseInt(localStorage.getItem('visitorCount')) || 0;
                    if (data.value > localCount) {
                        localStorage.setItem('visitorCount', data.value);
                        
                        // Update counter display if element exists
                        const counterElement = document.getElementById('visitor-count');
                        if (counterElement) {
                            const formatted = data.value.toString().padStart(4, '0');
                            counterElement.textContent = formatted;
                        }
                    }
                }
            })
            .catch(error => {
                // Fallback to localStorage count - no error needed
                console.log('Using local visitor count');
            });
    }

    // Enhanced Background Effects Setup
    function setupEnhancedBackgroundEffects() {
        initializeMatrixRain();
        initializeTechParticles();
        initializeEntranceAnimations();
    }
    
    function initializeMatrixRain() {
        const matrixContainer = document.querySelector('.matrix-rain-enhanced');
        if (!matrixContainer) return;
        
        // Performance check
        const isMobile = window.innerWidth <= 768;
        const isLowEnd = navigator.hardwareConcurrency < 4;
        
        if (isLowEnd) {
            matrixContainer.style.display = 'none';
            return;
        }
        
        const columnCount = isMobile ? 8 : 15;
        const chars = '01010101ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
        
        // Create matrix columns
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = (Math.random() * 100) + '%';
            column.style.animationDelay = (Math.random() * 5) + 's';
            column.style.animationDuration = (8 + Math.random() * 4) + 's';
            
            // Generate column text
            let columnText = '';
            for (let j = 0; j < 20; j++) {
                columnText += chars[Math.floor(Math.random() * chars.length)] + '\n';
            }
            column.textContent = columnText;
            
            matrixContainer.appendChild(column);
        }
    }
    
    function initializeTechParticles() {
        const particleContainer = document.querySelector('.tech-particles');
        if (!particleContainer) return;
        
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 5 : 10;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'tech-particle';
            particle.style.left = (Math.random() * 100) + '%';
            particle.style.animationDelay = (Math.random() * 20) + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            // Random colors
            const colors = ['var(--neon-cyan-core)', 'var(--neon-magenta-core)', 'var(--neon-yellow-core)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            particleContainer.appendChild(particle);
        }
    }
    
    function initializeEntranceAnimations() {
        // Initialize intersection observer for entrance animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.remove('entrance-prepare');
                        entry.target.classList.add('entrance-animate');
                    }, index * 50); // Staggered entrance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });
        
        // Observe all entrance elements
        document.querySelectorAll('.entrance-prepare').forEach(element => {
            observer.observe(element);
        });
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
        // Add glitch effects on hover
        setupGlitchEffects();
        
        // Add retro sound effects (if audio context is available)
        setupRetroSounds();
        
        // Add subtle interactive effects
        setupInteractiveEffects();
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
        let lastUpdate = 0;
        
        // Performance Optimization: Throttle mousemove events
        document.addEventListener('mousemove', throttle((e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > maxTrail) {
                trail.shift();
            }
            
            // Remove old trails (optimized)
            const now = Date.now();
            trail = trail.filter(point => now - point.time < 1000);
        }, 16)); // ~60fps throttling
        
        // Create subtle particle effect on click
        document.addEventListener('click', (e) => {
            createClickParticle(e.clientX, e.clientY);
        });
    }
    
    // Performance Utility: Throttle function to limit expensive operations
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
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
                0%, 100% { 
                    transform: translate(0); 
                    filter: brightness(1);
                }
                10% { 
                    transform: translate(-0.5px, 0.5px); 
                    filter: brightness(1.1);
                }
                20% { 
                    transform: translate(0.5px, -0.5px); 
                    filter: brightness(0.9);
                }
                30% { 
                    transform: translate(-0.5px, -0.5px); 
                    filter: brightness(1.05);
                }
                40% { 
                    transform: translate(0.5px, 0.5px); 
                    filter: brightness(0.95);
                }
                50% { 
                    transform: translate(0); 
                    filter: brightness(1.1);
                }
                60% { 
                    transform: translate(-0.5px, 0.5px); 
                    filter: brightness(1);
                }
                70% { 
                    transform: translate(0.5px, -0.5px); 
                    filter: brightness(1.05);
                }
                80% { 
                    transform: translate(-0.5px, -0.5px); 
                    filter: brightness(0.98);
                }
                90% { 
                    transform: translate(0.5px, 0.5px); 
                    filter: brightness(1.02);
                }
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
            
            // Smooth header transition with hysteresis to prevent flickering
            if (header) {
                // Use progressive scaling based on scroll position
                const scrollProgress = Math.min(scrollY / scrollThreshold, 1);
                
                // Hysteresis: Different thresholds for adding/removing class
                const scrolledThreshold = scrollThreshold;
                const unscrolledThreshold = scrollThreshold * 0.7; // 30% buffer zone
                
                const isCurrentlyScrolled = header.classList.contains('scrolled');
                
                if (!isCurrentlyScrolled && scrollY > scrolledThreshold) {
                    // Add scrolled class with buffer
                    header.classList.add('scrolled');
                    header.style.setProperty('--scale-factor', 0.8);
                } else if (isCurrentlyScrolled && scrollY < unscrolledThreshold) {
                    // Remove scrolled class with buffer
                    header.classList.remove('scrolled');
                    header.style.removeProperty('--scale-factor');
                } else if (isCurrentlyScrolled) {
                    // Maintain smooth scaling while scrolled
                    const scaleMultiplier = 0.8 + (0.2 * (1 - Math.min(scrollProgress - 1, 0.5) / 0.5));
                    header.style.setProperty('--scale-factor', Math.max(0.8, scaleMultiplier));
                }
                
                // Add scroll direction class for smooth transitions
                header.setAttribute('data-scroll-direction', scrollDirection);
                
                // Redundancy: Force state check every 100ms to prevent sticking
                if (Date.now() - (header._lastStateCheck || 0) > 100) {
                    header._lastStateCheck = Date.now();
                    
                    // Double-check state consistency
                    if (scrollY > scrolledThreshold && !header.classList.contains('scrolled')) {
                        header.classList.add('scrolled');
                    } else if (scrollY < unscrolledThreshold && header.classList.contains('scrolled')) {
                        header.classList.remove('scrolled');
                    }
                }
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
        
        // Performance check: disable on low-end devices
        if (navigator.hardwareConcurrency < 4) {
            matrixContainer.style.display = 'none';
            return;
        }
        
        // Reduce particles significantly for performance
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 8 : 15; // Reduced from 20/30
        
        // Clear existing particles
        matrixContainer.innerHTML = '';
        
        // Create optimized columns with document fragment
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < particleCount; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -100px;
                color: #00ff00;
                font-family: VT323, monospace;
                will-change: transform;
                transform: translateZ(0);
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
    
    // Laser Effects Setup
    function setupLaserEffects() {
        // Create laser grid background
        const laserGrid = document.createElement('div');
        laserGrid.className = 'laser-grid';
        document.body.appendChild(laserGrid);
        
        // Create laser sweep effects
        for (let i = 0; i < 3; i++) {
            const laserSweep = document.createElement('div');
            laserSweep.className = 'laser-sweep';
            document.body.appendChild(laserSweep);
        }
        
        // Add interactive laser particles on click
        document.addEventListener('click', createLaserParticle);
        
        // Add laser border effects to cards
        enhanceCardsWithLasers();
    }
    
    function createLaserParticle(e) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 2px;
            height: 2px;
            background: var(--neon-cyan);
            box-shadow: 
                0 0 10px var(--neon-cyan),
                0 0 20px var(--neon-cyan),
                0 0 30px var(--neon-cyan);
            pointer-events: none;
            z-index: 9999;
            animation: laser-particle-burst 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Create additional particles in a burst pattern
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const subParticle = particle.cloneNode();
                subParticle.style.left = (e.clientX + (Math.random() - 0.5) * 40) + 'px';
                subParticle.style.top = (e.clientY + (Math.random() - 0.5) * 40) + 'px';
                subParticle.style.animationDelay = (i * 0.1) + 's';
                document.body.appendChild(subParticle);
                
                setTimeout(() => subParticle.remove(), 1000);
            }, i * 50);
        }
        
        setTimeout(() => particle.remove(), 1000);
    }
    
    function enhanceCardsWithLasers() {
        const cards = document.querySelectorAll('.preview__card, .project-card, .blog-card, .philosophy__card');
        
        cards.forEach(card => {
            // Add laser corner effects
            const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            corners.forEach(corner => {
                const laserCorner = document.createElement('div');
                laserCorner.className = `laser-corner laser-corner--${corner}`;
                card.style.position = 'relative';
                card.appendChild(laserCorner);
            });
            
            // Add hover laser trail effect
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow += ', 0 0 40px rgba(0, 255, 255, 0.4)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = card.style.boxShadow.replace(', 0 0 40px rgba(0, 255, 255, 0.4)', '');
            });
        });
    }
    
    // Techno Easter Eggs Setup
    function setupTechnoEasterEggs() {
        // Konami Code easter egg
        setupKonamiCode();
        
        // Random techno glitches
        setupRandomGlitches();
        
        // Typing sound effects
        setupTypingSounds();
        
        // Secret developer console messages
        setupConsoleEasterEggs();
        
        // Laser keyboard shortcuts
        setupLaserShortcuts();
    }
    
    function setupKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let konamiProgress = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiProgress]) {
                konamiProgress++;
                if (konamiProgress === konamiCode.length) {
                    activateTechnoMode();
                    konamiProgress = 0;
                }
            } else {
                konamiProgress = 0;
            }
        });
    }
    
    function activateTechnoMode() {
        // Activate intense laser mode
        document.body.classList.add('techno-mode');
        
        // Play techno sound if available
        if (window.sfxManager) {
            window.sfxManager.playSound('click');
        }
        
        // Create laser storm
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createLaserParticle({
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight
                });
            }, i * 100);
        }
        
        showNotification('TECHNO_MODE.EXE ACTIVATED!');
        
        // Deactivate after 10 seconds
        setTimeout(() => {
            document.body.classList.remove('techno-mode');
            showNotification('TECHNO_MODE.EXE DEACTIVATED');
        }, 10000);
    }
    
    function setupRandomGlitches() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                const cards = document.querySelectorAll('.preview__card, .project-card, .blog-card');
                const randomCard = cards[Math.floor(Math.random() * cards.length)];
                if (randomCard) {
                    randomCard.style.animation = 'glitch 0.2s ease-in-out';
                    setTimeout(() => {
                        randomCard.style.animation = '';
                    }, 200);
                }
            }
        }, 5000); // Check every 5 seconds
    }
    
    function setupTypingSounds() {
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        
        textInputs.forEach(input => {
            input.addEventListener('keydown', () => {
                if (window.sfxManager && Math.random() < 0.3) { // 30% chance
                    window.sfxManager.playSound('hover');
                }
            });
        });
    }
    
    function setupConsoleEasterEggs() {
        const messages = [
            'ACCESSING MAINFRAME...',
            'NEURAL_NETWORK.SYS: LOADED',
            'QUANTUM_ALGORITHMS.DLL: ACTIVE',
            'PHILOSOPHY_ENGINE.EXE: RUNNING',
            'LASER_PROTOCOLS.INIT: COMPLETE',
            'TOMMY_NICOL.SYS: OPERATIONAL'
        ];
        
        messages.forEach((msg, index) => {
            setTimeout(() => {
                console.log(`%c${msg}`, 'color: #00ffff; font-family: monospace; font-weight: bold; text-shadow: 0 0 5px #00ffff;');
            }, index * 2000);
        });
    }
    
    function setupLaserShortcuts() {
        document.addEventListener('keydown', (e) => {
            // L key for laser burst
            if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
                e.preventDefault();
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createLaserParticle({
                            clientX: Math.random() * window.innerWidth,
                            clientY: Math.random() * window.innerHeight
                        });
                    }, i * 100);
                }
                showNotification('LASER_BURST.EXE ACTIVATED!');
            }
        });
    }
    
    // Enhanced Interactions for Crisp Feedback
    function setupEnhancedInteractions() {
        // Enhanced click feedback for all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .preview__card, .project-card, .blog-card, .nav__link');
        
        interactiveElements.forEach(element => {
            // Add ripple effect on click
            element.addEventListener('click', createRippleEffect);
            
            // Enhanced hover states
            element.addEventListener('mouseenter', enhanceHoverState);
            element.addEventListener('mouseleave', resetHoverState);
            
            // Touch feedback for mobile
            element.addEventListener('touchstart', addTouchFeedback);
            element.addEventListener('touchend', removeTouchFeedback);
        });
        
        // Smooth page transitions
        setupPageTransitions();
        
        // Enhanced form interactions
        setupFormAnimations();
    }
    
    function createRippleEffect(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        
        // Calculate click position relative to element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: ripple-expand 0.6s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        // Ensure element has relative positioning
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        element.style.overflow = 'hidden';
        
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
    
    function enhanceHoverState(e) {
        const element = e.currentTarget;
        
        // Add subtle glow effect
        if (!element.dataset.originalBoxShadow) {
            element.dataset.originalBoxShadow = getComputedStyle(element).boxShadow;
        }
        
        // Create floating particles around element
        if (Math.random() < 0.3) { // 30% chance
            createHoverParticles(element);
        }
    }
    
    function resetHoverState(e) {
        const element = e.currentTarget;
        // Reset will be handled by CSS transitions
    }
    
    function createHoverParticles(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top + Math.random() * rect.height}px;
                    width: 2px;
                    height: 2px;
                    background: var(--neon-cyan);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    animation: particle-float 1s ease-out forwards;
                    box-shadow: 0 0 6px var(--neon-cyan);
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1000);
            }, i * 100);
        }
    }
    
    function addTouchFeedback(e) {
        const element = e.currentTarget;
        element.style.transform = (element.style.transform || '') + ' scale(0.95)';
        element.style.transition = 'transform 0.1s ease-out';
    }
    
    function removeTouchFeedback(e) {
        const element = e.currentTarget;
        element.style.transform = element.style.transform.replace(' scale(0.95)', '');
    }
    
    function setupPageTransitions() {
        // Add smooth transitions when navigating between pages
        const pageLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href$=".html"]');
        
        pageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.target !== '_blank') {
                    // Add page transition effect
                    document.body.style.animation = 'page-transition-out 0.3s ease-in forwards';
                }
            });
        });
    }
    
    function setupFormAnimations() {
        const formInputs = document.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4)';
                
                // Create focus particles
                createFocusEffect(this);
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
            });
        });
    }
    
    function createFocusEffect(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 4; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top - 5}px;
                width: 1px;
                height: 8px;
                background: linear-gradient(to bottom, var(--neon-cyan), transparent);
                pointer-events: none;
                z-index: 9999;
                animation: focus-spark 0.8s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }
    }

    /**
     * Setup Logo Typing Animation and Home Button Functionality
     */
    function setupLogoTyping() {
        const logoBtn = document.querySelector('.logo-button');
        const textBtn = document.querySelector('.logo-text-button');
        const logoText = document.querySelector('.nav__logo-text');
        
        if (!textBtn || !logoText) return;
        
        // Store original text
        const originalText = logoText.textContent;
        
        // Start continuous typing animation cycle
        startTypingCycle(textBtn, logoText, originalText);
        
        // Add click functionality for both buttons
        function handleButtonClick(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Check if we're on the homepage
            const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
            
            if (isHomepage) {
                // On homepage: just play sound effect - NO visual changes to page
                if (window.sfxManager) {
                    window.sfxManager.playSound('click');
                }
                // Don't do anything else - no navigation, no page effects
            } else {
                // On other pages: navigate to home page
                window.location.href = 'index.html';
            }
        }
        
        // Add click handlers to both buttons
        if (logoBtn) {
            logoBtn.addEventListener('click', handleButtonClick);
        }
        if (textBtn) {
            textBtn.addEventListener('click', handleButtonClick);
        }
    }
    
    /**
     * Start continuous typing animation cycle
     */
    function startTypingCycle(textBtn, logoText, originalText) {
        let cycleCount = 0;
        const maxCycles = 3; // Run 3 times before cooldown
        const cooldownTime = 30000; // 30 second cooldown (3x longer)
        
        function runTypingCycle() {
            cycleCount++;
            
            // Clear logo text and add typing class
            logoText.textContent = '';
            textBtn.classList.remove('logo-text-complete');
            textBtn.classList.add('logo-text-typing');
            logoText.classList.add('logo-text-typing');
            
            let currentIndex = 0;
            const typingSpeed = 120; // milliseconds per character
            
            function typeCharacter() {
                if (currentIndex < originalText.length) {
                    logoText.textContent = originalText.slice(0, currentIndex + 1);
                    currentIndex++;
                    setTimeout(typeCharacter, typingSpeed);
                } else {
                    // Typing complete
                    setTimeout(() => {
                        textBtn.classList.remove('logo-text-typing');
                        textBtn.classList.add('logo-text-complete');
                        logoText.classList.remove('logo-text-typing');
                        logoText.classList.add('logo-text-complete');
                        
                        // Check if we should continue cycling or start cooldown
                        if (cycleCount < maxCycles) {
                            // Continue cycling after short delay
                            setTimeout(runTypingCycle, 2000);
                        } else {
                            // Start cooldown period
                            setTimeout(() => {
                                cycleCount = 0; // Reset counter
                                runTypingCycle(); // Restart the cycle
                            }, cooldownTime);
                        }
                    }, 1000); // Show completed text for 1 second
                }
            }
            
            // Start typing after a brief delay
            setTimeout(typeCharacter, 300);
        }
        
        // Start the first cycle
        runTypingCycle();
    }
    
    /**
     * Setup Clickable Cards Functionality
     */
    function setupClickableCards() {
        const cards = document.querySelectorAll('.preview__card[data-href]');
        
        cards.forEach(card => {
            card.addEventListener('click', function(event) {
                // Don't navigate if clicking on the actual link
                if (event.target.closest('.preview__link')) {
                    return; // Let the link handle navigation
                }
                
                const href = this.dataset.href;
                if (href) {
                    // Add smooth page transition
                    document.body.style.opacity = '0.9';
                    document.body.style.transform = 'scale(0.98)';
                    document.body.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
            
            // Add cursor pointer to indicate clickability
            card.style.cursor = 'pointer';
        });
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
    
    // Download Button Achievement Sound Setup
    function setupDownloadButton() {
        const downloadButton = document.getElementById('resume-download');
        if (!downloadButton) return;
        
        downloadButton.addEventListener('click', function(event) {
            // Play the achievement sound
            if (window.sfxManager && window.sfxManager.isEnabled()) {
                window.sfxManager.playSound('achievement', 1.0);
            }
            
            // Optional: Add a visual effect when clicked
            const button = event.currentTarget;
            button.classList.add('achievement-flash');
            
            // Remove the flash class after animation
            setTimeout(() => {
                button.classList.remove('achievement-flash');
            }, 1000);
        });
    }
    
    // Smooth Content Optimization During Resize
    function optimizeContentDuringResize() {
        const viewportWidth = window.innerWidth;
        const cards = document.querySelectorAll('.preview__card, .project-card, .blog-card');
        const retroCells = document.querySelectorAll('.retro-table-cell');
        
        // Optimize card animations based on viewport size
        cards.forEach(card => {
            if (viewportWidth < 600) {
                // Reduce animation complexity on smaller screens
                card.style.setProperty('--animation-complexity', 'reduced');
            } else {
                card.style.removeProperty('--animation-complexity');
            }
        });
        
        // Smooth text reflow optimization
        retroCells.forEach(cell => {
            const textContent = cell.textContent.trim();
            if (textContent.length > 100 && viewportWidth < 500) {
                // Add smooth text reflow for long content on small screens
                cell.classList.add('text-optimize-small');
            } else {
                cell.classList.remove('text-optimize-small');
            }
        });
        
        // Trigger smooth re-layout for animated elements
        requestAnimationFrame(() => {
            const animatedElements = document.querySelectorAll('.animate-in');
            animatedElements.forEach((element, index) => {
                // Subtle re-entrance animation
                element.style.animationDelay = `${index * 20}ms`;
                element.classList.add('resize-animate');
                
                setTimeout(() => {
                    element.classList.remove('resize-animate');
                    element.style.animationDelay = '';
                }, 500);
            });
        });
    }
    
    // Enhanced Performance Monitoring
    function setupPerformanceOptimizations() {
        // Smooth scroll behavior optimization
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Optimize animations based on scroll speed
                    const scrollSpeed = Math.abs(window.scrollY - (window.lastScrollTop || 0));
                    window.lastScrollTop = window.scrollY;
                    
                    if (scrollSpeed > 10) {
                        // Fast scrolling - reduce animation complexity
                        document.body.classList.add('fast-scroll');
                        clearTimeout(window.scrollTimeout);
                        window.scrollTimeout = setTimeout(() => {
                            document.body.classList.remove('fast-scroll');
                        }, 150);
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Intersection Observer for smart animation triggers
        const observerOptions = {
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '50px 0px'
        };
        
        const smartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const visibilityRatio = entry.intersectionRatio;
                    
                    // Progressive enhancement based on visibility
                    if (visibilityRatio > 0.5) {
                        element.classList.add('fully-visible');
                    } else {
                        element.classList.remove('fully-visible');
                    }
                }
            });
        }, observerOptions);
        
        // Observe key elements
        document.querySelectorAll('.preview__card, .retro-table-cell, .btn--primary').forEach(el => {
            smartObserver.observe(el);
        });
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