// Component loader and visitor counter functionality

// Load header and footer components
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('includes/header.html');
        const headerHTML = await headerResponse.text();
        
        // Load footer
        const footerResponse = await fetch('includes/footer.html');
        const footerHTML = await footerResponse.text();
        
        // Insert header at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        
        // Insert footer before closing body tag
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
        // Set active navigation link
        setActiveNavLink();
        
        // Initialize visitor counter
        initVisitorCounter();
        
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === 'index.html' && href === '/') ||
            (currentPage === '' && href === '/')) {
            link.classList.add('nav__link--active');
        }
    });
}

// Visitor counter functionality
function initVisitorCounter() {
    // Check if user has visited before
    if (!localStorage.getItem('hasVisited')) {
        // Increment visitor count on server
        fetch('/api/increment-visitor-count', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.log('Visitor counter API not available, using fallback');
            // Fallback to localStorage counter for demo
            const currentCount = parseInt(localStorage.getItem('fallbackVisitorCount') || '0');
            localStorage.setItem('fallbackVisitorCount', (currentCount + 1).toString());
        });
        
        localStorage.setItem('hasVisited', 'true');
    }
    
    // Get current visitor count
    fetch('/api/visitor-count')
        .then(res => res.json())
        .then(data => {
            document.getElementById('visitor-count').innerText = data.count;
        })
        .catch(error => {
            console.log('Visitor counter API not available, using fallback');
            // Fallback to localStorage counter for demo
            const fallbackCount = localStorage.getItem('fallbackVisitorCount') || '42';
            document.getElementById('visitor-count').innerText = fallbackCount;
        });
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}