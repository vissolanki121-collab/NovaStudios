(function () {
    // 1. Determine active language
    let activeLang = localStorage.getItem('lang');
    if (!activeLang) {
        const browserLang = navigator.language || navigator.userLanguage || '';
        activeLang = browserLang.toLowerCase().startsWith('es') ? 'es' : 'en';
        localStorage.setItem('lang', activeLang);
    }
    
    // Make active lang accessible globally
    window.currentLang = activeLang;

    // Helper to resolve nested keys: e.g. "navbar.home" in translations.en
    window.t = function (key) {
        if (!key) return '';
        const keys = key.split('.');
        
        // Try current language
        let value = window.translations[window.currentLang];
        for (let i = 0; i < keys.length; i++) {
            if (value && value[keys[i]] !== undefined) {
                value = value[keys[i]];
            } else {
                value = null;
                break;
            }
        }
        
        // Fallback to default (English) if not found or empty
        if (value === null || value === undefined) {
            value = window.translations['en'];
            for (let i = 0; i < keys.length; i++) {
                if (value && value[keys[i]] !== undefined) {
                    value = value[keys[i]];
                } else {
                    value = null;
                    break;
                }
            }
        }
        
        // Return key if translation is completely missing
        return value !== null && value !== undefined ? value : key;
    };

    // Helper to translate the whole DOM
    window.translatePage = function () {
        // Set HTML lang attribute
        document.documentElement.setAttribute('lang', window.currentLang);

        // 1. Standard text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = window.t(key);
        });

        // 2. HTML content (for elements containing inline HTML tags like anchors or icons)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            el.innerHTML = window.t(key);
        });

        // 3. Input placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.setAttribute('placeholder', window.t(key));
        });

        // 4. Aria labels
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            el.setAttribute('aria-label', window.t(key));
        });

        // 5. SEO Meta tags (Description)
        document.querySelectorAll('[data-i18n-content]').forEach(el => {
            const key = el.getAttribute('data-i18n-content');
            el.setAttribute('content', window.t(key));
        });

        // 6. Input/Button values
        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const key = el.getAttribute('data-i18n-value');
            el.setAttribute('value', window.t(key));
        });

        // 7. Page title
        const titleEl = document.querySelector('title');
        if (titleEl && titleEl.hasAttribute('data-i18n')) {
            const key = titleEl.getAttribute('data-i18n');
            titleEl.textContent = window.t(key);
        }

        // Sync switcher elements value if they exist
        const switchers = document.querySelectorAll('.lang-select');
        switchers.forEach(s => {
            s.value = window.currentLang;
        });
    };

    // Helper to change language
    window.setLanguage = function (lang) {
        if (lang === 'en' || lang === 'es') {
            window.currentLang = lang;
            localStorage.setItem('lang', lang);
            window.translatePage();
        }
    };

    // Inject language switcher and initialize page translations on DOM interactive
    document.addEventListener('DOMContentLoaded', () => {
        const navbarActions = document.querySelector('.navbar-actions');
        if (navbarActions) {
            // Check if switcher already exists to prevent duplicate injections
            if (!document.getElementById('lang-select')) {
                const themeToggle = document.getElementById('theme-toggle') || navbarActions.querySelector('.theme-toggle');
                const langSelectWrapper = document.createElement('div');
                langSelectWrapper.className = 'lang-select-wrapper';
                langSelectWrapper.innerHTML = `
                    <select id="lang-select" class="lang-select" aria-label="Select Language">
                        <option value="en">EN</option>
                        <option value="es">ES</option>
                    </select>
                `;
                
                // Bind change event
                const select = langSelectWrapper.querySelector('select');
                select.addEventListener('change', (e) => {
                    window.setLanguage(e.target.value);
                });

                if (themeToggle) {
                    navbarActions.insertBefore(langSelectWrapper, themeToggle);
                } else {
                    navbarActions.appendChild(langSelectWrapper);
                }
            }
        }
        
        // Run initial translation
        window.translatePage();
    });
})();
