(() => {
    'use strict';

    const toggle = document.querySelector('[data-nav-toggle]');
    const links = document.querySelector('[data-nav-links]');
    const interfaceLanguage = window.TommyLanguage?.current
        || (document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'en');
    const navigationLabels = interfaceLanguage === 'es'
        ? { open: 'Abrir navegación', close: 'Cerrar navegación' }
        : { open: 'Open navigation', close: 'Close navigation' };

    if (links) {
        const language = interfaceLanguage;
        const targetLanguage = language === 'es' ? 'en' : 'es';
        const languageNames = language === 'es'
            ? { short: 'EN', full: 'English', label: 'Ver el sitio en inglés' }
            : { short: 'ES', full: 'Español', label: 'View the site in Spanish' };
        const languageItem = document.createElement('li');
        const languageLink = document.createElement('a');

        languageLink.className = 'nav__link language-switch';
        languageLink.href = window.TommyLanguage?.counterpartUrl(targetLanguage) || '#';
        languageLink.hreflang = targetLanguage;
        languageLink.lang = targetLanguage;
        languageLink.setAttribute('aria-label', languageNames.label);
        languageLink.innerHTML = `<span>${languageNames.short}</span><span class="language-switch__name">${languageNames.full}</span>`;
        languageLink.addEventListener('click', () => window.TommyLanguage?.setPreference(targetLanguage));
        languageItem.append(languageLink);
        links.append(languageItem);
    }

    if (toggle && links) {
        toggle.setAttribute('aria-label', navigationLabels.open);

        const closeMenu = () => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', navigationLabels.open);
            links.dataset.open = 'false';
            document.body.classList.remove('nav-open');
        };

        toggle.addEventListener('click', () => {
            const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', String(willOpen));
            toggle.setAttribute('aria-label', willOpen ? navigationLabels.close : navigationLabels.open);
            links.dataset.open = String(willOpen);
            document.body.classList.toggle('nav-open', willOpen);
            if (willOpen) links.querySelector('a')?.focus();
        });

        links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeMenu();
                toggle.focus();
            }
        });

        document.addEventListener('click', event => {
            if (links.dataset.open === 'true' && !event.target.closest('.nav')) closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 800) closeMenu();
        });
    }

    const article = document.querySelector('.article');
    if (article) {
        const articleIsSpanish = interfaceLanguage === 'es';
        const header = document.querySelector('.site-header');
        const articleHeader = article.querySelector('.article__header');
        const content = article.querySelector('.article__content');
        const headings = content ? [...content.querySelectorAll('h2')] : [];

        const progress = document.createElement('div');
        progress.className = 'reading-progress';
        progress.setAttribute('aria-hidden', 'true');
        progress.innerHTML = '<span class="reading-progress__bar"></span>';
        document.body.append(progress);
        const progressBar = progress.firstElementChild;

        if (articleHeader && headings.length > 1) {
            const toc = document.createElement('nav');
            toc.className = 'article-toc';
            toc.setAttribute('aria-label', articleIsSpanish ? 'En esta página' : 'On this page');
            const listItems = headings.map((heading, index) => {
                if (!heading.id) heading.id = `section-${index + 1}`;
                return `<li><a href="#${heading.id}">${heading.textContent}</a></li>`;
            }).join('');
            toc.innerHTML = `<p class="article-toc__label">${articleIsSpanish ? 'En esta página' : 'On this page'}</p><ol>${listItems}</ol>`;
            articleHeader.insertAdjacentElement('afterend', toc);
        }

        const backToTop = document.createElement('a');
        backToTop.className = 'back-to-top';
        backToTop.href = '#main-content';
        backToTop.setAttribute('aria-label', articleIsSpanish ? 'Volver al inicio del artículo' : 'Back to the beginning of the article');
        backToTop.innerHTML = `<span aria-hidden="true">↑</span> ${articleIsSpanish ? 'Inicio' : 'Top'}`;
        document.body.append(backToTop);

        let lastScrollY = window.scrollY;
        let ticking = false;
        const updateReadingUi = () => {
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
            progressBar.style.transform = `scaleX(${ratio})`;
            backToTop.dataset.visible = String(window.scrollY > Math.max(700, window.innerHeight));

            if (header && window.innerWidth <= 800 && document.body.classList.contains('nav-open') === false) {
                const movingDown = window.scrollY > lastScrollY + 5;
                const movingUp = window.scrollY < lastScrollY - 5;
                if (movingDown && window.scrollY > 140) header.classList.add('site-header--reading-hidden');
                if (movingUp || window.scrollY < 80) header.classList.remove('site-header--reading-hidden');
            } else {
                header?.classList.remove('site-header--reading-hidden');
            }

            lastScrollY = window.scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateReadingUi);
                ticking = true;
            }
        }, { passive: true });
        window.addEventListener('resize', updateReadingUi);
        updateReadingUi();
    }

    document.querySelectorAll('[data-current-year]').forEach(element => {
        element.textContent = String(new Date().getFullYear());
    });
})();
