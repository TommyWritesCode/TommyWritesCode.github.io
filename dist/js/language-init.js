(() => {
    'use strict';

    const STORAGE_KEY = 'tommy-site-language';
    const SUPPORTED_LANGUAGES = new Set(['en', 'es']);
    const currentLanguage = document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'en';

    const readPreference = () => {
        try {
            const value = window.localStorage.getItem(STORAGE_KEY);
            return SUPPORTED_LANGUAGES.has(value) ? value : null;
        } catch {
            return null;
        }
    };

    const writePreference = language => {
        if (!SUPPORTED_LANGUAGES.has(language)) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, language);
        } catch {
            // Language selection still works when storage is unavailable.
        }
    };

    const detectBrowserLanguage = () => {
        const candidates = Array.isArray(navigator.languages) && navigator.languages.length
            ? navigator.languages
            : [navigator.language];

        for (const candidate of candidates) {
            const language = String(candidate || '').toLowerCase().split('-')[0];
            if (SUPPORTED_LANGUAGES.has(language)) return language;
        }

        return 'en';
    };

    const generatedCounterpartPath = targetLanguage => {
        const path = window.location.pathname;

        if (window.location.protocol === 'file:') {
            const markers = ['/production-src/website/', '/dist/'];
            const marker = markers.find(value => path.includes(value));
            if (marker) {
                const [prefix, relativePath] = path.split(marker);
                const normalizedPath = relativePath.replace(/^es\//, '');
                return `${prefix}${marker}${targetLanguage === 'es' ? 'es/' : ''}${normalizedPath}`;
            }
        }

        if (targetLanguage === 'es') {
            if (path === '/') return '/es/';
            return path.startsWith('/es/') ? path : `/es${path}`;
        }

        const englishPath = path.replace(/^\/es(?=\/|$)/, '');
        return englishPath || '/';
    };

    const counterpartUrl = targetLanguage => {
        const explicitCounterpart = document.querySelector('meta[name="language-counterpart"]')?.content;
        const url = new URL(window.location.href);

        if (explicitCounterpart && targetLanguage !== currentLanguage) {
            let explicitUrl;
            if (window.location.protocol === 'file:' && explicitCounterpart.startsWith('/')) {
                const markers = ['/production-src/website/', '/dist/'];
                const marker = markers.find(value => url.pathname.includes(value));
                if (marker) {
                    const prefix = url.pathname.split(marker)[0];
                    explicitUrl = new URL(url.href);
                    explicitUrl.pathname = `${prefix}${marker}${explicitCounterpart.slice(1)}`;
                }
            }
            explicitUrl ||= new URL(explicitCounterpart, window.location.href);
            explicitUrl.search = url.search;
            explicitUrl.hash = url.hash;
            return explicitUrl.href;
        }

        url.pathname = generatedCounterpartPath(targetLanguage);
        return url.href;
    };

    window.TommyLanguage = {
        current: currentLanguage,
        counterpartUrl,
        setPreference: writePreference
    };

    const savedPreference = readPreference();
    const preferredLanguage = savedPreference || detectBrowserLanguage();
    const shouldRedirect = preferredLanguage !== currentLanguage
        && (savedPreference !== null || currentLanguage === 'en');

    if (shouldRedirect) window.location.replace(counterpartUrl(preferredLanguage));
})();
