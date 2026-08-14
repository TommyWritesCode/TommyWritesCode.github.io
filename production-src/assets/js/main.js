(() => {
    'use strict';

    const toggle = document.querySelector('[data-nav-toggle]');
    const links = document.querySelector('[data-nav-links]');

    if (toggle && links) {
        const closeMenu = () => {
            toggle.setAttribute('aria-expanded', 'false');
            links.dataset.open = 'false';
        };

        toggle.addEventListener('click', () => {
            const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', String(willOpen));
            links.dataset.open = String(willOpen);
        });

        links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeMenu();
                toggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 760) closeMenu();
        });
    }

    document.querySelectorAll('[data-current-year]').forEach(element => {
        element.textContent = String(new Date().getFullYear());
    });
})();
