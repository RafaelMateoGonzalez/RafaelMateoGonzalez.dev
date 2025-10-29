/**
 * GOOGLE ANALYTICS MANAGER
 * Solo se carga si el usuario acepta cookies analíticas
 */

const PortfolioAnalytics = {
    // IMPORTANTE: Reemplaza 'G-XXXXXXXXXX' con tu ID de Google Analytics
    measurementId: 'G-T67PNET8HG',
    
    isInitialized: false,
    
    // Inicializar Google Analytics
    init() {
        // Verificar si ya está inicializado
        if (this.isInitialized) {
            console.log('Analytics ya inicializado');
            return;
        }
        
        // Verificar consentimiento
        if (!CookieConsent.isAnalyticsAllowed()) {
            console.log('Analytics bloqueado - sin consentimiento');
            return;
        }
        
        console.log('Inicializando Google Analytics...');
        
        // Cargar script de Google Analytics
        this.loadGtagScript();
        
        // Configurar Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', this.measurementId, {
            'anonymize_ip': true, // Anonimizar IPs (RGPD)
            'cookie_flags': 'SameSite=None;Secure'
        });
        
        this.isInitialized = true;
        console.log('Google Analytics inicializado correctamente');
        
        // Registrar evento de consentimiento
        this.trackEvent('consent', 'analytics_accepted', 'user_consent');
    },
    
    // Cargar script de Google Analytics
    loadGtagScript() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);
    },
    
    // Registrar evento personalizado
    trackEvent(category, action, label = null, value = null) {
        if (!this.isInitialized || !window.gtag) {
            console.log('Analytics no disponible para evento:', category, action);
            return;
        }
        
        const eventParams = {
            event_category: category,
            event_label: label
        };
        
        if (value !== null) {
            eventParams.value = value;
        }
        
        window.gtag('event', action, eventParams);
        console.log('Evento registrado:', category, action, label);
    },
    
    // Registrar vista de página (opcional, GA4 lo hace automáticamente)
    trackPageView(pagePath = null) {
        if (!this.isInitialized || !window.gtag) return;
        
        const path = pagePath || window.location.pathname;
        window.gtag('event', 'page_view', {
            page_path: path
        });
    },
    
    // Eventos específicos del portfolio
    events: {
        // CV descargado
        downloadCV(language) {
            PortfolioAnalytics.trackEvent('engagement', 'download_cv', language);
        },
        
        // Cambio de idioma
        changeLanguage(from, to) {
            PortfolioAnalytics.trackEvent('user_interaction', 'change_language', `${from}_to_${to}`);
        },
        
        // Cambio de tema
        changeTheme(theme) {
            PortfolioAnalytics.trackEvent('user_interaction', 'change_theme', theme);
        },
        
        // Click en proyecto
        clickProject(projectName) {
            PortfolioAnalytics.trackEvent('engagement', 'click_project', projectName);
        },
        
        // Click en red social
        clickSocial(platform) {
            PortfolioAnalytics.trackEvent('engagement', 'click_social', platform);
        },
        
        // Contacto por email
        clickEmail() {
            PortfolioAnalytics.trackEvent('engagement', 'click_email', 'contact');
        },
        
        // Navegación por sección
        navigateSection(section) {
            PortfolioAnalytics.trackEvent('navigation', 'scroll_to_section', section);
        },
        
        // Tiempo en el sitio (llamar cuando el usuario se va)
        timeOnSite(seconds) {
            PortfolioAnalytics.trackEvent('engagement', 'time_on_site', null, seconds);
        }
    }
};

// Hacer disponible globalmente
window.PortfolioAnalytics = PortfolioAnalytics;

// Registrar tiempo en el sitio
let startTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (PortfolioAnalytics.isInitialized && timeSpent > 5) {
        PortfolioAnalytics.events.timeOnSite(timeSpent);
    }
});