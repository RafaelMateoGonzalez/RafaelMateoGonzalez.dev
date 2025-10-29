/**
 * COOKIE CONSENT MANAGER
 * Compatible con RGPD/GDPR
 */

const CookieConsent = {
    // Configuración
    cookieName: 'portfolio_cookie_consent',
    cookieExpireDays: 365,
    
    // Traducciones
    translations: {
        es: {
            title: '🍪 Uso de Cookies',
            description: 'Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. Al aceptar, permites el uso de cookies analíticas.',
            accept: 'Aceptar todo',
            reject: 'Rechazar todo',
            settings: 'Configurar',
            settingsTitle: 'Configuración de Cookies',
            save: 'Guardar preferencias',
            cancel: 'Cancelar',
            necessary: {
                title: 'Cookies Necesarias',
                description: 'Estas cookies son esenciales para el funcionamiento del sitio web.',
                required: '(Siempre activas)'
            },
            analytics: {
                title: 'Cookies Analíticas',
                description: 'Nos ayudan a entender cómo interactúas con el sitio mediante Google Analytics.'
            }
        },
        en: {
            title: '🍪 Cookie Usage',
            description: 'We use cookies to improve your experience and analyze site traffic. By accepting, you allow the use of analytical cookies.',
            accept: 'Accept all',
            reject: 'Reject all',
            settings: 'Settings',
            settingsTitle: 'Cookie Settings',
            save: 'Save preferences',
            cancel: 'Cancel',
            necessary: {
                title: 'Necessary Cookies',
                description: 'These cookies are essential for the website to function.',
                required: '(Always active)'
            },
            analytics: {
                title: 'Analytics Cookies',
                description: 'Help us understand how you interact with the site through Google Analytics.'
            }
        },
        fr: {
            title: '🍪 Utilisation des Cookies',
            description: 'Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site. En acceptant, vous autorisez l\'utilisation de cookies analytiques.',
            accept: 'Tout accepter',
            reject: 'Tout rejeter',
            settings: 'Configurer',
            settingsTitle: 'Configuration des Cookies',
            save: 'Enregistrer les préférences',
            cancel: 'Annuler',
            necessary: {
                title: 'Cookies Nécessaires',
                description: 'Ces cookies sont essentiels au fonctionnement du site web.',
                required: '(Toujours actifs)'
            },
            analytics: {
                title: 'Cookies Analytiques',
                description: 'Nous aident à comprendre comment vous interagissez avec le site via Google Analytics.'
            }
        },
        de: {
            title: '🍪 Cookie-Nutzung',
            description: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und den Site-Traffic zu analysieren. Durch Akzeptieren erlauben Sie die Verwendung analytischer Cookies.',
            accept: 'Alle akzeptieren',
            reject: 'Alle ablehnen',
            settings: 'Einstellungen',
            settingsTitle: 'Cookie-Einstellungen',
            save: 'Einstellungen speichern',
            cancel: 'Abbrechen',
            necessary: {
                title: 'Notwendige Cookies',
                description: 'Diese Cookies sind für die Funktion der Website unerlässlich.',
                required: '(Immer aktiv)'
            },
            analytics: {
                title: 'Analytische Cookies',
                description: 'Helfen uns zu verstehen, wie Sie mit der Website über Google Analytics interagieren.'
            }
        }
    },
    
    // Inicializar
    init() {
        // Verificar si ya hay consentimiento guardado
        const consent = this.getConsent();
        
        if (consent === null) {
            // No hay consentimiento, mostrar banner
            this.createBanner();
        } else {
            // Ya hay consentimiento, cargar según preferencias
            if (consent.analytics) {
                this.enableAnalytics();
            }
        }
    },
    
    // Crear banner de cookies
    createBanner() {
        const lang = window.currentLang || 'es';
        const t = this.translations[lang];
        
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.id = 'cookieConsent';
        banner.innerHTML = `
            <div class="cookie-consent-container">
                <div class="cookie-consent-text">
                    <h4 data-cookie-translate="title">${t.title}</h4>
                    <p data-cookie-translate="description">${t.description}</p>
                </div>
                <div class="cookie-consent-buttons">
                    <button class="cookie-btn cookie-btn-reject" onclick="CookieConsent.rejectAll()">
                        <span data-cookie-translate="reject">${t.reject}</span>
                    </button>
                    <button class="cookie-btn cookie-btn-settings" onclick="CookieConsent.openSettings()">
                        <span data-cookie-translate="settings">${t.settings}</span>
                    </button>
                    <button class="cookie-btn cookie-btn-accept" onclick="CookieConsent.acceptAll()">
                        <span data-cookie-translate="accept">${t.accept}</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Mostrar con animación
        setTimeout(() => {
            banner.classList.add('show');
        }, 500);
        
        // Crear modal de configuración
        this.createSettingsModal();
    },
    
    // Crear modal de configuración
    createSettingsModal() {
        const lang = window.currentLang || 'es';
        const t = this.translations[lang];
        
        const modal = document.createElement('div');
        modal.className = 'cookie-settings-modal';
        modal.id = 'cookieSettingsModal';
        modal.innerHTML = `
            <div class="cookie-settings-content">
                <h3 data-cookie-translate="settingsTitle">${t.settingsTitle}</h3>
                
                <div class="cookie-setting-item">
                    <div class="cookie-setting-info">
                        <h4 data-cookie-translate="necessary.title">${t.necessary.title}</h4>
                        <p data-cookie-translate="necessary.description">${t.necessary.description}</p>
                        <p class="required" data-cookie-translate="necessary.required">${t.necessary.required}</p>
                    </div>
                    <label class="cookie-toggle">
                        <input type="checkbox" checked disabled>
                        <span class="cookie-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="cookie-setting-item">
                    <div class="cookie-setting-info">
                        <h4 data-cookie-translate="analytics.title">${t.analytics.title}</h4>
                        <p data-cookie-translate="analytics.description">${t.analytics.description}</p>
                    </div>
                    <label class="cookie-toggle">
                        <input type="checkbox" id="analyticsToggle">
                        <span class="cookie-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="cookie-settings-footer">
                    <button class="cookie-btn cookie-btn-reject" onclick="CookieConsent.closeSettings()">
                        <span data-cookie-translate="cancel">${t.cancel}</span>
                    </button>
                    <button class="cookie-btn cookie-btn-accept" onclick="CookieConsent.saveSettings()">
                        <span data-cookie-translate="save">${t.save}</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeSettings();
            }
        });
    },
    
    // Actualizar textos cuando cambia el idioma
    updateLanguage(lang) {
        const t = this.translations[lang] || this.translations.es;
        
        // Actualizar todos los elementos con data-cookie-translate
        document.querySelectorAll('[data-cookie-translate]').forEach(element => {
            const key = element.getAttribute('data-cookie-translate');
            const keys = key.split('.');
            
            let translation = t;
            for (let k of keys) {
                translation = translation[k];
            }
            
            if (translation) {
                element.textContent = translation;
            }
        });
    },
    
    // Aceptar todo
    acceptAll() {
        this.saveConsent({ necessary: true, analytics: true });
        this.enableAnalytics();
        this.hideBanner();
    },
    
    // Rechazar todo
    rejectAll() {
        this.saveConsent({ necessary: true, analytics: false });
        this.hideBanner();
    },
    
    // Abrir configuración
    openSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.add('show');
        }
    },
    
    // Cerrar configuración
    closeSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.remove('show');
        }
    },
    
    // Guardar configuración
    saveSettings() {
        const analyticsChecked = document.getElementById('analyticsToggle').checked;
        
        this.saveConsent({
            necessary: true,
            analytics: analyticsChecked
        });
        
        if (analyticsChecked) {
            this.enableAnalytics();
        }
        
        this.closeSettings();
        this.hideBanner();
    },
    
    // Ocultar banner
    hideBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 400);
        }
        
        // También eliminar el modal
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.remove();
        }
    },
    
    // Guardar consentimiento
    saveConsent(consent) {
        const data = {
            ...consent,
            timestamp: new Date().toISOString()
        };
        
        const expires = new Date();
        expires.setDate(expires.getDate() + this.cookieExpireDays);
        
        document.cookie = `${this.cookieName}=${JSON.stringify(data)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    },
    
    // Obtener consentimiento
    getConsent() {
        const name = this.cookieName + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        
        for (let cookie of cookieArray) {
            cookie = cookie.trim();
            if (cookie.indexOf(name) === 0) {
                try {
                    return JSON.parse(cookie.substring(name.length));
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    },
    
    // Habilitar Analytics
    enableAnalytics() {
        if (window.PortfolioAnalytics) {
            window.PortfolioAnalytics.init();
        }
    },
    
    // Verificar si Analytics está permitido
    isAnalyticsAllowed() {
        const consent = this.getConsent();
        return consent && consent.analytics === true;
    }
};

// Inicializar cuando el DOM esté listo
// Exponer CookieConsent globalmente
window.CookieConsent = CookieConsent;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
} else {
    CookieConsent.init();
}