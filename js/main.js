// Main JavaScript file for Tommy Nicol's Portfolio Website
// Handles theme toggle, mobile navigation, collapsible sections, and animations

(function() {
    'use strict';
    
    // DOM elements
    const body = document.body;
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Initialize the application
    function init() {
        setupThemeToggle();
        setupMobileNavigation();
        setupCollapsibleSections();
        setupScrollAnimations();
        setupSmoothScrolling();
        setupRetroEffects();
        setupCollapsingHeaders();
        setupPerformanceOptimizations();
    }
    
    // Theme Toggle Functionality - Professional vs Fun
    function setupThemeToggle() {
        // Check for saved theme preference or default to fun mode
        const savedTheme = localStorage.getItem('theme') || 'fun';
        setTheme(savedTheme);
        
        // Theme toggle event listener
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = getCurrentTheme();
                const newTheme = currentTheme === 'professional' ? 'fun' : 'professional';
                setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
        
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
    
    function getCurrentTheme() {
        // Check which CSS file is active
        const professionalCSS = document.querySelector('link[href*="professional.css"]');
        return professionalCSS && !professionalCSS.disabled ? 'professional' : 'fun';
    }
    
    function setTheme(theme) {
        const retroCSS = document.querySelector('link[href*="retro-90s.css"]');
        let professionalCSS = document.querySelector('link[href*="professional.css"]');
        
        // Add smooth transition class
        body.classList.add('theme-transitioning');
        
        if (theme === 'professional') {
            // Create professional CSS if it doesn't exist
            if (!professionalCSS) {
                professionalCSS = document.createElement('link');
                professionalCSS.rel = 'stylesheet';
                professionalCSS.href = 'css/professional.css';
                professionalCSS.onload = () => {
                    // Wait for CSS to load before making changes
                    setTimeout(() => {
                        if (retroCSS) retroCSS.disabled = true;
                        updateContentForProfessional();
                        body.classList.remove('theme-transitioning');
                    }, 50);
                };
                document.head.appendChild(professionalCSS);
            } else {
                professionalCSS.disabled = false;
                // Small delay to ensure CSS is active
                setTimeout(() => {
                    if (retroCSS) retroCSS.disabled = true;
                    updateContentForProfessional();
                    body.classList.remove('theme-transitioning');
                }, 50);
            }
            body.setAttribute('data-theme', 'dark');
        } else {
            // Enable fun mode
            if (retroCSS) retroCSS.disabled = false;
            setTimeout(() => {
                if (professionalCSS) professionalCSS.disabled = true;
                updateContentForFun();
                body.classList.remove('theme-transitioning');
            }, 50);
            body.setAttribute('data-theme', 'dark');
        }
        
        // Update theme toggle button accessibility
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                theme === 'professional' ? 'Switch to fun mode' : 'Switch to professional mode'
            );
        }
    }
    
    function updateContentForProfessional() {
        // Update navigation logo
        const navLogo = document.querySelector('.nav__logo');
        if (navLogo) {
            navLogo.textContent = 'Tommy Nicol';
        }
        
        // Update hero content
        const heroTitle = document.querySelector('.hero__title');
        if (heroTitle) {
            heroTitle.innerHTML = 'Software Developer & Philosophy Student';
        }
        
        const heroSubtitle = document.querySelector('.hero__subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = 'Building thoughtful software solutions with clean code and philosophical insight';
        }
        
        const heroDescription = document.querySelector('.hero__description');
        if (heroDescription) {
            heroDescription.textContent = 'Passionate about creating meaningful technology that bridges the gap between human needs and digital solutions. Currently pursuing Computer Science and Philosophy at the University of Pittsburgh.';
        }
        
        // Update action buttons
        const primaryBtn = document.querySelector('.btn--primary');
        if (primaryBtn) {
            primaryBtn.textContent = 'View My Work';
        }
        
        const secondaryBtn = document.querySelector('.btn--secondary');
        if (secondaryBtn) {
            secondaryBtn.textContent = 'Learn About Me';
        }
        
        // Update preview cards
        updatePreviewCards('professional');
        
        // Update subpage headers
        updateSubpageHeaders('professional');
        
        // Update tech tags
        updateTechTags('professional');
        
        // Update navigation links
        updateNavigationLinks('professional');
        
        // Update page-specific content
        updatePageSpecificContent('professional');
    }
    
    function updateContentForFun() {
        // Restore retro content
        const navLogo = document.querySelector('.nav__logo');
        if (navLogo) {
            navLogo.textContent = 'TOMMY_NICOL.EXE';
        }
        
        const heroTitle = document.querySelector('.hero__title');
        if (heroTitle) {
            heroTitle.innerHTML = "WELCOME TO TOMMY'S CYBER SPACE";
        }
        
        const heroSubtitle = document.querySelector('.hero__subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = 'COMP_SCI && PHILOSOPHY_STUDENT.EXE';
        }
        
        const heroDescription = document.querySelector('.hero__description');
        if (heroDescription) {
            heroDescription.innerHTML = '*** BUILDING THOUGHTFUL SOFTWARE SOLUTIONS WITH CLEAN CODE AND PHILOSOPHICAL DESIGN *** EXPERIENCE THE INTERSECTION OF TECHNOLOGY AND HUMAN CONSCIOUSNESS *** ENTER THE DIGITAL REALM OF INNOVATION ***';
        }
        
        const primaryBtn = document.querySelector('.btn--primary');
        if (primaryBtn) {
            primaryBtn.textContent = 'ENTER_BIO.EXE';
        }
        
        const secondaryBtn = document.querySelector('.btn--secondary');
        if (secondaryBtn) {
            secondaryBtn.textContent = 'LOAD_PROJECTS.EXE';
        }
        
        // Restore retro preview cards
        updatePreviewCards('fun');
        
        // Restore retro subpage headers
        updateSubpageHeaders('fun');
        
        // Restore retro tech tags
        updateTechTags('fun');
        
        // Restore retro navigation
        updateNavigationLinks('fun');
        
        // Restore page-specific content
        updatePageSpecificContent('fun');
    }
    
    function updatePreviewCards(mode) {
        const cards = document.querySelectorAll('.preview__card');
        if (mode === 'professional') {
            // Add professional icons and update content
            cards.forEach((card, index) => {
                const title = card.querySelector('.preview__title');
                const text = card.querySelector('.preview__text');
                const link = card.querySelector('.preview__link');
                
                // Add icon if it doesn't exist
                let icon = card.querySelector('.preview__icon');
                if (!icon) {
                    icon = document.createElement('div');
                    icon.className = 'preview__icon';
                    card.insertBefore(icon, title);
                }
                
                if (index === 0) { // About
                    icon.textContent = '👨‍💻';
                    title.textContent = 'About Me';
                    text.textContent = 'Learn about my background in Computer Science and Philosophy, my approach to problem-solving, and what drives my passion for technology.';
                    link.textContent = 'Read more';
                } else if (index === 1) { // Projects
                    icon.textContent = '🚀';
                    title.textContent = 'Projects';
                    text.textContent = 'Explore my portfolio of full-stack applications, algorithms, and tools. Each project includes detailed thought processes and technical decisions.';
                    link.textContent = 'View projects';
                } else if (index === 2) { // Blog
                    icon.textContent = '✍️';
                    title.textContent = 'Writing';
                    text.textContent = 'Read my thoughts on software development, philosophy of technology, and the intersection of human values with digital innovation.';
                    link.textContent = 'Read articles';
                }
            });
        } else {
            // Restore retro content
            cards.forEach((card, index) => {
                const icon = card.querySelector('.preview__icon');
                if (icon) icon.remove();
                
                const title = card.querySelector('.preview__title');
                const text = card.querySelector('.preview__text');
                const link = card.querySelector('.preview__link');
                
                if (index === 0) { // About
                    title.innerHTML = 'ABOUT.EXE <span class="badge-new">NEW!</span>';
                    text.innerHTML = 'LOADING PERSONAL DATA... COMP_SCI & PHILOSOPHY FUSION ALGORITHMS... PROBLEM_SOLVING PROTOCOLS INITIALIZED...';
                    link.textContent = 'EXECUTE >>';
                } else if (index === 1) { // Projects
                    title.innerHTML = 'PROJECTS.DB <span class="badge-hot">HOT!</span>';
                    text.innerHTML = 'ACCESS PORTFOLIO DATABASE... WEB_APPS & ALGORITHMS DETECTED... DEVELOPMENT_PROCESS.LOG AVAILABLE...';
                    link.textContent = 'CONNECT >>';
                } else if (index === 2) { // Blog
                    title.innerHTML = 'BLOG.TXT <span class="badge-new">NEW!</span>';
                    text.innerHTML = 'READING NEURAL_THOUGHTS.TXT... SOFTWARE_DEV & PHILOSOPHY MERGE... HUMAN_TECH_INTERFACE.DOC READY...';
                    link.textContent = 'DOWNLOAD >>';
                }
            });
        }
    }
    
    function updateSubpageHeaders(mode) {
        const pageTitle = document.querySelector('.fun-header__title');
        const pageSubtitle = document.querySelector('.fun-header__subtitle');
        
        if (!pageTitle) return;
        
        // Detect current page
        const currentPage = getCurrentPageType();
        
        if (mode === 'professional') {
            // Add eyebrow text
            let eyebrow = document.querySelector('.fun-header__eyebrow');
            if (!eyebrow) {
                eyebrow = document.createElement('div');
                eyebrow.className = 'fun-header__eyebrow';
                pageTitle.parentNode.insertBefore(eyebrow, pageTitle);
            }
            
            // Update based on current page
            switch (currentPage) {
                case 'about':
                    eyebrow.textContent = 'Background';
                    pageTitle.textContent = 'About Me';
                    pageSubtitle.textContent = 'Student, developer, and philosopher exploring the meaningful intersection of technology and human values.';
                    break;
                case 'projects':
                    eyebrow.textContent = 'Portfolio';
                    pageTitle.textContent = 'My Projects';
                    pageSubtitle.textContent = 'A collection of applications, tools, and experiments showcasing my development journey and technical skills.';
                    break;
                case 'blog':
                    eyebrow.textContent = 'Insights';
                    pageTitle.textContent = 'Writing & Thoughts';
                    pageSubtitle.textContent = 'Exploring the intersection of technology, philosophy, and human experience through writing.';
                    break;
                case 'contact':
                    eyebrow.textContent = 'Connect';
                    pageTitle.textContent = 'Get In Touch';
                    pageSubtitle.textContent = 'Interested in collaboration, have questions, or just want to chat? I\'d love to hear from you.';
                    break;
            }
        } else {
            // Remove eyebrow and restore retro content
            const eyebrow = document.querySelector('.fun-header__eyebrow');
            if (eyebrow) eyebrow.remove();
            
            // Restore original retro titles based on current page
            switch (currentPage) {
                case 'about':
                    pageTitle.innerHTML = 'PERSONAL_DATA.DAT <span class="badge-new">NEW!</span>';
                    pageSubtitle.textContent = 'LOADING BACKGROUND_INFO... PHILOSOPHY && COMP_SCI.FUSION_ALGORITHMS...';
                    break;
                case 'projects':
                    pageTitle.innerHTML = 'PROJECT_DATABASE.DB <span class="badge-hot">HOT!</span>';
                    pageSubtitle.textContent = 'ACCESSING PORTFOLIO_ARCHIVE... LOADING DEV_WORK && THOUGHT_PROCESSES...';
                    break;
                case 'blog':
                    pageTitle.innerHTML = 'NEURAL_THOUGHTS.TXT <span class="badge-hot">HOT!</span>';
                    pageSubtitle.textContent = 'READING BRAIN_DUMP.LOG... CODE && PHILOSOPHY && TECH_HUMANITY.INTERFACE...';
                    break;
                case 'contact':
                    pageTitle.innerHTML = 'CONTACT_INTERFACE.EXE <span class="badge-hot">HOT!</span>';
                    pageSubtitle.textContent = 'ESTABLISHING CONNECTION... COMMUNICATION_PROTOCOL: ACTIVE';
                    break;
            }
        }
    }
    
    function getCurrentPageType() {
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop().toLowerCase();
        
        if (filename.includes('about') || filename === 'about.html') return 'about';
        if (filename.includes('project') || filename === 'projects.html') return 'projects';
        if (filename.includes('blog') || filename === 'blog.html') return 'blog';
        if (filename.includes('contact') || filename === 'contact.html') return 'contact';
        return 'home';
    }
    
    function updateTechTags(mode) {
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            if (mode === 'professional') {
                // Clean up retro extensions and normalize names
                let text = tag.textContent.replace(/\.JS$|\.PY$|\.CSS$|\.DB$|\.SRV$|\.JSX$|\.TS$|\.PLOT$|\.GUI$/g, '');
                
                // Normalize common tech names
                if (text === 'JAVASCRIPT') text = 'JavaScript';
                else if (text === 'NODE') text = 'Node.js';
                else if (text === 'EXPRESS') text = 'Express';
                else if (text === 'MONGODB') text = 'MongoDB';
                else if (text === 'PYTHON') text = 'Python';
                else if (text === 'REACT') text = 'React';
                else if (text === 'TYPESCRIPT') text = 'TypeScript';
                else if (text === 'CSS_MODULES') text = 'CSS Modules';
                else if (text === 'FIREBASE') text = 'Firebase';
                else if (text === 'TKINTER') text = 'Tkinter';
                else if (text === 'MATPLOTLIB') text = 'Matplotlib';
                else if (text.includes('_')) text = text.replace(/_/g, ' ');
                
                tag.textContent = text;
            } else {
                // Restore retro extensions
                const text = tag.textContent;
                if (text === 'JavaScript') tag.textContent = 'JAVASCRIPT.JS';
                else if (text === 'Node.js') tag.textContent = 'NODE.JS';
                else if (text === 'Express') tag.textContent = 'EXPRESS.SRV';
                else if (text === 'MongoDB') tag.textContent = 'MONGODB.DB';
                else if (text === 'Python') tag.textContent = 'PYTHON.PY';
                else if (text === 'React') tag.textContent = 'REACT.JSX';
                else if (text === 'TypeScript') tag.textContent = 'TYPESCRIPT.TS';
                else if (text === 'CSS Modules') tag.textContent = 'CSS_MODULES.CSS';
                else if (text === 'Firebase') tag.textContent = 'FIREBASE.DB';
                else if (text === 'Tkinter') tag.textContent = 'TKINTER.GUI';
                else if (text === 'Matplotlib') tag.textContent = 'MATPLOTLIB.PLOT';
                else if (text.includes(' ')) tag.textContent = text.replace(/\s+/g, '_').toUpperCase();
            }
        });
    }
    
    function updatePageSpecificContent(mode) {
        const currentPage = getCurrentPageType();
        
        if (mode === 'professional') {
            updateProjectContent();
            updateBlogContent(); 
            updateContactContent();
            updateFormLabels();
        } else {
            restoreRetroProjectContent();
            restoreRetroBlogContent();
            restoreRetroContactContent();
            restoreRetroFormLabels();
        }
    }
    
    function updateProjectContent() {
        // Update project card titles and descriptions
        const projectTitles = document.querySelectorAll('.project-card__title');
        projectTitles.forEach(title => {
            if (title.textContent.includes('TASK_MANAGER.EXE')) {
                title.textContent = 'Task Management Application';
            } else if (title.textContent.includes('ALGORITHM_VISUALIZER.PY')) {
                title.textContent = 'Algorithm Visualization Tool';
            } else if (title.textContent.includes('PHILOSOPHY_PLATFORM.EXE')) {
                title.textContent = 'Philosophy Discussion Platform';
            }
        });
        
        // Update project descriptions
        const projectDescriptions = document.querySelectorAll('.project-card__description');
        projectDescriptions.forEach((desc, index) => {
            if (index === 0) { // Task Manager
                desc.innerHTML = 'A comprehensive full-stack web application for personal and team task management. Features real-time collaboration, intuitive user interface, and scalable architecture designed for productivity optimization.';
            } else if (index === 1) { // Algorithm Visualizer
                desc.innerHTML = 'An interactive educational application that visualizes sorting and searching algorithms. Built to enhance student learning through dynamic animations and step-by-step algorithm analysis.';
            } else if (index === 2) { // Philosophy Platform
                desc.innerHTML = 'A sophisticated platform for philosophical discussions featuring argument mapping and logical fallacy detection. Designed to facilitate productive discourse and collaborative reasoning.';
            }
        });
        
        // Update project links
        const projectLinks = document.querySelectorAll('.project-card__link');
        projectLinks.forEach(link => {
            if (link.textContent.includes('ACCESS_CODE')) {
                link.textContent = 'View Code';
            } else if (link.textContent.includes('LIVE_DEMO')) {
                link.textContent = 'Live Demo';
            }
        });
        
        // Update thought process triggers
        const thoughtTriggers = document.querySelectorAll('.collapsible__trigger span');
        thoughtTriggers.forEach(trigger => {
            if (trigger.textContent.includes('THOUGHT_PROCESS.LOG')) {
                trigger.textContent = 'Technical Details';
            }
        });
        
        // Update thought process content
        const thoughtLists = document.querySelectorAll('.thought-process li');
        thoughtLists.forEach(item => {
            let text = item.textContent;
            // Remove retro formatting and make professional
            text = text.replace(/>/g, '').replace(/\./g, ': ').replace(/_/g, ' ');
            text = text.replace(/&&/g, 'and').replace(/PROTOCOL/g, 'approach');
            text = text.replace(/EXE|SYS|ACTIVE|ENABLED|MODE/g, '');
            text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            item.textContent = text.trim();
        });
    }
    
    function updateBlogContent() {
        // Update blog card titles
        const blogTitles = document.querySelectorAll('.blog-card__title a');
        blogTitles.forEach(title => {
            if (title.textContent.includes('AI_ETHICS.PHI')) {
                title.textContent = 'Ethics in Artificial Intelligence';
            } else if (title.textContent.includes('CLEAN_CODE_PHILOSOPHY.TXT')) {
                title.textContent = 'The Philosophy of Clean Code';
            } else if (title.textContent.includes('ACCESSIBLE_WEB.GUIDE')) {
                title.textContent = 'Building Accessible Web Experiences';
            } else if (title.textContent.includes('CS_PHILOSOPHY.INTERSECTION')) {
                title.textContent = 'Computer Science Meets Philosophy';
            } else if (title.textContent.includes('DEBUGGING_DETECTIVE.EXE')) {
                title.textContent = 'Debugging as Detective Work';
            } else if (title.textContent.includes('FUNCTIONAL_PROGRAMMING.INTRO')) {
                title.textContent = 'Introduction to Functional Programming';
            }
        });
        
        // Update blog excerpts
        const blogExcerpts = document.querySelectorAll('.blog-card__excerpt');
        blogExcerpts.forEach((excerpt, index) => {
            switch (index) {
                case 0:
                    excerpt.textContent = 'Exploring the moral implications of AI systems and the responsibility of developers in creating ethical technology solutions.';
                    break;
                case 1:
                    excerpt.textContent = 'Beyond conventions and best practices: a philosophical stance on code quality, communication, and respect in software development.';
                    break;
                case 2:
                    excerpt.textContent = 'Moving beyond compliance checklists to build truly inclusive digital experiences with practical examples and insights.';
                    break;
                case 3:
                    excerpt.textContent = 'Examining how computer science and philosophy complement each other in unexpected ways, from logic to ethics.';
                    break;
                case 4:
                    excerpt.textContent = 'Approaching code debugging through systematic investigation and logical reasoning, much like detective work.';
                    break;
                case 5:
                    excerpt.textContent = 'Understanding the philosophical underpinnings of functional programming and its impact on code quality and clarity.';
                    break;
            }
        });
        
        // Update read more links
        const readMoreLinks = document.querySelectorAll('.blog-card__read-more');
        readMoreLinks.forEach(link => {
            link.textContent = 'Read Article';
        });
        
        // Update categories
        const categories = document.querySelectorAll('.blog-card__category');
        categories.forEach(category => {
            if (category.textContent.includes('PHILOSOPHY.PHI')) {
                category.textContent = 'Philosophy';
            } else if (category.textContent.includes('DEVELOPMENT.DEV')) {
                category.textContent = 'Development';
            } else if (category.textContent.includes('TUTORIAL.TUT')) {
                category.textContent = 'Tutorial';
            } else if (category.textContent.includes('REFLECTION.REF')) {
                category.textContent = 'Reflection';
            }
        });
    }
    
    function updateContactContent() {
        // Update contact headings
        const contactHeadings = document.querySelectorAll('.contact__heading');
        contactHeadings.forEach(heading => {
            if (heading.textContent.includes('CONNECTION_ESTABLISHED.SYS')) {
                heading.textContent = 'Let\'s Connect';
            } else if (heading.textContent.includes('MESSAGE_TRANSMITTER.EXE')) {
                heading.textContent = 'Send a Message';
            }
        });
        
        // Update contact text
        const contactTexts = document.querySelectorAll('.contact__text');
        contactTexts.forEach(text => {
            if (text.innerHTML.includes('PROJECT_COLLABORATION.REQUEST')) {
                text.innerHTML = 'I\'m always interested in new opportunities and collaborations. Whether you have a project in mind, want to discuss technology and philosophy, or just want to say hello, I\'d love to hear from you.';
            }
        });
        
        // Update contact method titles
        const methodTitles = document.querySelectorAll('.contact__method-title');
        methodTitles.forEach(title => {
            if (title.textContent.includes('EMAIL.PROTOCOL')) {
                title.textContent = 'Email';
            } else if (title.textContent.includes('SOCIAL_NETWORKS.DB')) {
                title.textContent = 'Social Links';
            }
        });
        
        // Update social links
        const socialLinks = document.querySelectorAll('.contact__social-link');
        socialLinks.forEach(link => {
            if (link.textContent.includes('GITHUB.CODE')) {
                link.textContent = 'GitHub';
            } else if (link.textContent.includes('LINKEDIN.PROF')) {
                link.textContent = 'LinkedIn';
            } else if (link.textContent.includes('TWITTER.FEED')) {
                link.textContent = 'Twitter';
            }
        });
        
        // Update contact note
        const contactNote = document.querySelector('.contact__note-text');
        if (contactNote && contactNote.innerHTML.includes('SYSTEM_STATUS.NOTE')) {
            contactNote.innerHTML = 'Currently studying at the University of Pittsburgh, pursuing Computer Science and Philosophy. I typically respond to messages within a few days and prioritize project ideas and technology discussions.';
        }
    }
    
    function updateFormLabels() {
        // Update form labels
        const formLabels = document.querySelectorAll('.form__label');
        formLabels.forEach(label => {
            if (label.textContent.includes('USER_NAME.INPUT')) {
                label.textContent = 'Name';
            } else if (label.textContent.includes('EMAIL_ADDRESS.ADDR')) {
                label.textContent = 'Email';
            } else if (label.textContent.includes('MESSAGE_SUBJECT.STR')) {
                label.textContent = 'Subject';
            } else if (label.textContent.includes('MESSAGE_CONTENT.TXT')) {
                label.textContent = 'Message';
            }
        });
        
        // Update form placeholders
        const formInputs = document.querySelectorAll('.form__input, .form__textarea');
        formInputs.forEach(input => {
            if (input.placeholder.includes('ENTER_NAME')) {
                input.placeholder = 'Your name';
            } else if (input.placeholder.includes('USER@DOMAIN.COM')) {
                input.placeholder = 'your.email@example.com';
            } else if (input.placeholder.includes('ENTER_SUBJECT')) {
                input.placeholder = 'Subject line';
            } else if (input.placeholder.includes('COMPOSE_MESSAGE')) {
                input.placeholder = 'Your message...';
            }
        });
        
        // Update submit button
        const submitBtn = document.querySelector('.form__submit');
        if (submitBtn && submitBtn.textContent.includes('TRANSMIT_MESSAGE.EXE')) {
            submitBtn.textContent = 'Send Message';
        }
    }
    
    function restoreRetroProjectContent() {
        // Restore retro project titles
        const projectTitles = document.querySelectorAll('.project-card__title');
        projectTitles.forEach((title, index) => {
            if (index === 0) {
                title.innerHTML = 'TASK_MANAGER.EXE <span class="badge-new">NEW!</span>';
            } else if (index === 1) {
                title.innerHTML = 'ALGORITHM_VISUALIZER.PY <span class="badge-hot">HOT!</span>';
            } else if (index === 2) {
                title.innerHTML = 'PHILOSOPHY_PLATFORM.EXE <span class="badge-new">NEW!</span>';
            }
        });
        
        // Restore retro descriptions
        const projectDescriptions = document.querySelectorAll('.project-card__description');
        projectDescriptions.forEach((desc, index) => {
            if (index === 0) {
                desc.innerHTML = '> FULL_STACK WEB_APPLICATION.EXE<br>> PERSONAL && TEAM_TASK_MANAGEMENT<br>> REAL_TIME_COLLABORATION.PROTOCOL: ACTIVE<br>> USER_INTERFACE.GUI: INTUITIVE_MODE<br>> STATUS: DEPLOYMENT_READY';
            } else if (index === 1) {
                desc.innerHTML = '> INTERACTIVE_APPLICATION.EXE<br>> SORTING && SEARCHING_ALGORITHMS.VIS<br>> STUDENT_LEARNING.ENHANCEMENT: ACTIVE<br>> ANIMATION.PROTOCOL: UNDERSTANDING_MODE<br>> STATUS: EDUCATIONAL_TOOL.READY';
            } else if (index === 2) {
                desc.innerHTML = '> PHILOSOPHICAL_DISCUSSIONS.PLATFORM<br>> ARGUMENT_MAPPING.PROTOCOL: ACTIVE<br>> LOGICAL_FALLACY.DETECTION: ENABLED<br>> COLLABORATIVE_REASONING.TOOLS: LOADED<br>> STATUS: DISCOURSE_ENGINE.READY';
            }
        });
        
        // Restore retro links
        const projectLinks = document.querySelectorAll('.project-card__link');
        projectLinks.forEach(link => {
            if (link.textContent === 'View Code') {
                link.textContent = 'ACCESS_CODE >>';
            } else if (link.textContent === 'Live Demo') {
                link.textContent = 'LIVE_DEMO >>';
            }
        });
        
        // Restore thought process triggers
        const thoughtTriggers = document.querySelectorAll('.collapsible__trigger span');
        thoughtTriggers.forEach(trigger => {
            if (trigger.textContent === 'Technical Details') {
                trigger.textContent = 'THOUGHT_PROCESS.LOG';
            }
        });
    }
    
    function restoreRetroBlogContent() {
        // Restore retro blog titles
        const blogTitles = document.querySelectorAll('.blog-card__title a');
        blogTitles.forEach((title, index) => {
            switch (index) {
                case 0:
                    title.innerHTML = 'AI_ETHICS.PHI <span class="badge-new">NEW!</span>';
                    break;
                case 1:
                    title.innerHTML = 'CLEAN_CODE_PHILOSOPHY.TXT <span class="badge-hot">HOT!</span>';
                    break;
                case 2:
                    title.innerHTML = 'ACCESSIBLE_WEB.GUIDE <span class="badge-new">NEW!</span>';
                    break;
                case 3:
                    title.innerHTML = 'CS_PHILOSOPHY.INTERSECTION <span class="badge-hot">HOT!</span>';
                    break;
                case 4:
                    title.innerHTML = 'DEBUGGING_DETECTIVE.EXE <span class="badge-new">NEW!</span>';
                    break;
                case 5:
                    title.innerHTML = 'FUNCTIONAL_PROGRAMMING.INTRO <span class="badge-hot">HOT!</span>';
                    break;
            }
        });
        
        // Restore retro excerpts
        const blogExcerpts = document.querySelectorAll('.blog-card__excerpt');
        blogExcerpts.forEach((excerpt, index) => {
            switch (index) {
                case 0:
                    excerpt.innerHTML = '> LOADING MORAL_IMPLICATIONS.DAT...<br>> AI_PHILOSOPHICAL_FRAMEWORK.EXE: RUNNING<br>> INTELLIGENT_MACHINES.ETHICS: ANALYZING<br>> CREATOR_RESPONSIBILITY.PROTOCOL: ACTIVE';
                    break;
                case 1:
                    excerpt.innerHTML = '> BEYOND_CONVENTIONS.PROTOCOL: ACTIVE<br>> PHILOSOPHICAL_STANCE.MODE: ENGAGED<br>> COMMUNICATION && RESPECT.VALUES: LOADED<br>> CS_PHILOSOPHY.FUSION: COMPLETE';
                    break;
                case 2:
                    excerpt.innerHTML = '> COMPLIANCE_CHECKLISTS.BEYOND<br>> INCLUSIVE_EXPERIENCES.BUILD<br>> PRACTICAL_EXAMPLES.LOADED<br>> PHILOSOPHICAL_INSIGHTS.ACTIVE';
                    break;
                case 3:
                    excerpt.innerHTML = '> COMP_SCI && PHILOSOPHY.MERGE<br>> UNEXPECTED_WAYS.COMPLEMENT<br>> LOGIC && ETHICS.ANALYSIS<br>> COMPUTATION_NATURE.EXPLORE';
                    break;
                case 4:
                    excerpt.innerHTML = '> CODE_DEBUGGING.MYSTERY_SOLVING<br>> LOGICAL_REASONING.PROTOCOL<br>> SYSTEMATIC_INVESTIGATION.MODE<br>> PHILOSOPHICAL_INQUIRY.ACTIVE';
                    break;
                case 5:
                    excerpt.innerHTML = '> PHILOSOPHICAL_UNDERPINNINGS.PARADIGM<br>> IMMUTABILITY && PURE_FUNCTIONS.IMPORTANCE<br>> CODE_QUALITY && MENTAL_CLARITY.ENHANCEMENT<br>> THINKING_IN_FUNCTIONS.PROTOCOL: ACTIVE';
                    break;
            }
        });
        
        // Restore read more links
        const readMoreLinks = document.querySelectorAll('.blog-card__read-more');
        readMoreLinks.forEach(link => {
            link.textContent = 'EXECUTE >>';
        });
        
        // Restore categories
        const categories = document.querySelectorAll('.blog-card__category');
        categories.forEach((category, index) => {
            switch (index) {
                case 0:
                    category.textContent = 'PHILOSOPHY.PHI';
                    break;
                case 1:
                    category.textContent = 'DEVELOPMENT.DEV';
                    break;
                case 2:
                    category.textContent = 'TUTORIAL.TUT';
                    break;
                case 3:
                    category.textContent = 'REFLECTION.REF';
                    break;
                case 4:
                    category.textContent = 'DEVELOPMENT.DEV';
                    break;
                case 5:
                    category.textContent = 'TUTORIAL.TUT';
                    break;
            }
        });
    }
    
    function restoreRetroContactContent() {
        // Restore retro headings
        const contactHeadings = document.querySelectorAll('.contact__heading');
        contactHeadings.forEach(heading => {
            if (heading.textContent === 'Let\'s Connect') {
                heading.innerHTML = 'CONNECTION_ESTABLISHED.SYS <span class="badge-new">NEW!</span>';
            } else if (heading.textContent === 'Send a Message') {
                heading.innerHTML = 'MESSAGE_TRANSMITTER.EXE <span class="badge-hot">HOT!</span>';
            }
        });
        
        // Restore retro contact text
        const contactTexts = document.querySelectorAll('.contact__text');
        contactTexts.forEach(text => {
            if (!text.innerHTML.includes('PROJECT_COLLABORATION.REQUEST')) {
                text.innerHTML = '> PROJECT_COLLABORATION.REQUEST: ACCEPTED<br>> PHILOSOPHY && TECHNOLOGY.DISCUSSION: ENABLED<br>> HELLO_PROTOCOL.SIMPLE: ACTIVE<br>> COMMUNICATION_CHANNELS.OPEN: TRUE';
            }
        });
        
        // Restore method titles
        const methodTitles = document.querySelectorAll('.contact__method-title');
        methodTitles.forEach(title => {
            if (title.textContent === 'Email') {
                title.textContent = 'EMAIL.PROTOCOL';
            } else if (title.textContent === 'Social Links') {
                title.textContent = 'SOCIAL_NETWORKS.DB';
            }
        });
        
        // Restore social links
        const socialLinks = document.querySelectorAll('.contact__social-link');
        socialLinks.forEach(link => {
            if (link.textContent === 'GitHub') {
                link.textContent = 'GITHUB.CODE';
            } else if (link.textContent === 'LinkedIn') {
                link.textContent = 'LINKEDIN.PROF';
            } else if (link.textContent === 'Twitter') {
                link.textContent = 'TWITTER.FEED';
            }
        });
        
        // Restore contact note
        const contactNote = document.querySelector('.contact__note-text');
        if (contactNote && !contactNote.innerHTML.includes('SYSTEM_STATUS.NOTE')) {
            contactNote.innerHTML = '> SYSTEM_STATUS.NOTE: CURRENTLY_STUDENT @ UNIVERSITY_OF_PITTSBURGH.EDU<br>> RESPONSE_TIME.VARIABLE: MESSAGE_QUEUE.PROCESSING<br>> PRIORITY_HIGH: PROJECT_IDEAS && PHILOSOPHY_TECH.QUESTIONS<br>> COMMUNICATION_DELAY.ACCEPTABLE: FEW_DAYS.MAX<br>> ENGAGEMENT_LEVEL: MAXIMUM_FOR_INTERESTING.CONTENT';
        }
    }
    
    function restoreRetroFormLabels() {
        // Restore retro form labels
        const formLabels = document.querySelectorAll('.form__label');
        formLabels.forEach(label => {
            if (label.textContent === 'Name') {
                label.textContent = 'USER_NAME.INPUT';
            } else if (label.textContent === 'Email') {
                label.textContent = 'EMAIL_ADDRESS.ADDR';
            } else if (label.textContent === 'Subject') {
                label.textContent = 'MESSAGE_SUBJECT.STR';
            } else if (label.textContent === 'Message') {
                label.textContent = 'MESSAGE_CONTENT.TXT';
            }
        });
        
        // Restore retro placeholders
        const formInputs = document.querySelectorAll('.form__input, .form__textarea');
        formInputs.forEach(input => {
            if (input.placeholder === 'Your name') {
                input.placeholder = '> ENTER_NAME...';
            } else if (input.placeholder === 'your.email@example.com') {
                input.placeholder = '> USER@DOMAIN.COM';
            } else if (input.placeholder === 'Subject line') {
                input.placeholder = '> ENTER_SUBJECT...';
            } else if (input.placeholder === 'Your message...') {
                input.placeholder = '> COMPOSE_MESSAGE...\\n> THINKING_IN_PROGRESS...\\n> AWAITING_INPUT...';
            }
        });
        
        // Restore submit button
        const submitBtn = document.querySelector('.form__submit');
        if (submitBtn && submitBtn.textContent === 'Send Message') {
            submitBtn.textContent = 'TRANSMIT_MESSAGE.EXE';
        }
    }
    
    function updateNavigationLinks(mode) {
        const navLinks = document.querySelectorAll('.fun-nav__link');
        navLinks.forEach(link => {
            if (mode === 'professional') {
                const href = link.getAttribute('href');
                if (href.includes('index.html')) link.textContent = 'Home';
                else if (href.includes('about.html')) link.textContent = 'About';
                else if (href.includes('projects.html')) link.textContent = 'Projects';
                else if (href.includes('blog.html')) link.textContent = 'Writing';
                else if (href.includes('contact.html')) link.textContent = 'Contact';
            } else {
                const href = link.getAttribute('href');
                if (href.includes('index.html')) link.textContent = 'HOME.EXE';
                else if (href.includes('about.html')) link.textContent = 'ABOUT.DAT';
                else if (href.includes('projects.html')) link.textContent = 'PROJECTS.DB';
                else if (href.includes('blog.html')) link.textContent = 'BLOG.TXT';
                else if (href.includes('contact.html')) link.textContent = 'CONTACT.SYS';
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
            setTheme,
            openMobileNav,
            closeMobileNav,
            expandSection,
            collapseSection,
            setupRetroEffects
        };
        showTerminalWelcome();
    }
    
})();