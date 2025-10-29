// Variable de idioma actual
let currentLang = 'es';

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    
    // Track cambio de tema
    if (window.PortfolioAnalytics && window.PortfolioAnalytics.isInitialized) {
        const theme = this.checked ? 'dark' : 'light';
        PortfolioAnalytics.events.changeTheme(theme);
    }
});

// Función para traducir la página
function translatePage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Language Selector
const languageSelector = document.getElementById('languageSelector');
const savedLang = localStorage.getItem('language') || 'es';

// Aplicar idioma guardado
currentLang = savedLang;
languageSelector.value = savedLang;
if (savedLang !== 'es') {
    translatePage(savedLang);
}

// Event listener para cambio de idioma (UN SOLO LISTENER)
languageSelector.addEventListener('change', function() {
    const oldLang = currentLang;
    const newLang = this.value;
    
    currentLang = newLang;
    translatePage(currentLang);
    localStorage.setItem('language', currentLang);
    
    // Actualizar textos de cookies si el banner está visible
    if (window.CookieConsent) {
        CookieConsent.updateLanguage(newLang);
    }
    
    // Reiniciar typing animation
    stopTypingAnimation();
    startTypingAnimation();
    
    // Track cambio de idioma en Analytics
    if (window.PortfolioAnalytics && window.PortfolioAnalytics.isInitialized) {
        PortfolioAnalytics.events.changeLanguage(oldLang, newLang);
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Animate skill bars when in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-progress').forEach(bar => {
                bar.classList.add('animate');
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item.closest('.card'));
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

// Particle effect on hero section (optional enhancement)
const hero = document.querySelector('.hero');
let particles = [];

for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = 'rgba(255,255,255,0.5)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = `float ${5 + Math.random() * 10}s linear infinite`;
    hero.appendChild(particle);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========================================
// TYPING EFFECT - Múltiples textos rotando
// ========================================
const typingLines = {
    es: [
        'Full Stack Developer .NET',
        'Especialista en C# y SQL Server',
        'Creador de APIs RESTful',
        'Desarrollador Backend y Frontend',
        'Apasionado por el código limpio'
    ],
    en: [
        'Full Stack .NET Developer',
        'C# and SQL Server Specialist',
        'RESTful APIs Creator',
        'Backend and Frontend Developer',
        'Passionate about clean code'
    ],
    fr: [
        'Développeur Full Stack .NET',
        'Spécialiste C# et SQL Server',
        'Créateur d\'APIs RESTful',
        'Développeur Backend et Frontend',
        'Passionné par le code propre'
    ],
    de: [
        'Full Stack .NET Entwickler',
        'C# und SQL Server Spezialist',
        'RESTful APIs Ersteller',
        'Backend und Frontend Entwickler',
        'Leidenschaftlich für sauberen Code'
    ]
};

let typingTimeout;
let erasingTimeout;
let lineIndex = 0;
let isTypingPaused = false;

function typeWriter(text, charIndex = 0) {
    const element = document.getElementById('typed-text');
    if (!element || isTypingPaused) return;
    
    if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        typingTimeout = setTimeout(() => typeWriter(text, charIndex + 1), 100);
    } else {
        // Esperar 2 segundos antes de borrar
        erasingTimeout = setTimeout(() => eraseText(), 2000);
    }
}

function eraseText() {
    const element = document.getElementById('typed-text');
    if (!element || isTypingPaused) return;
    
    const currentText = element.textContent;
    if (currentText.length > 0) {
        element.textContent = currentText.substring(0, currentText.length - 1);
        erasingTimeout = setTimeout(() => eraseText(), 50);
    } else {
        // Pasar a la siguiente línea
        lineIndex = (lineIndex + 1) % typingLines[currentLang].length;
        typingTimeout = setTimeout(() => typeWriter(typingLines[currentLang][lineIndex]), 500);
    }
}

function startTypingAnimation() {
    // Limpiar timeouts anteriores
    clearTimeout(typingTimeout);
    clearTimeout(erasingTimeout);
    
    const element = document.getElementById('typed-text');
    if (element) {
        isTypingPaused = false;
        lineIndex = 0;
        element.textContent = '';
        
        // Esperar 1.5 segundos después de la animación del hero
        typingTimeout = setTimeout(() => {
            if (typingLines[currentLang] && typingLines[currentLang].length > 0) {
                typeWriter(typingLines[currentLang][0]);
            }
        }, 1500);
    }
}

function stopTypingAnimation() {
    isTypingPaused = true;
    clearTimeout(typingTimeout);
    clearTimeout(erasingTimeout);
}

// Iniciar typing effect cuando cargue la página
window.addEventListener('load', startTypingAnimation);

// ========================================
// ANALYTICS EVENT TRACKING
// ========================================

// Track descarga de CV
document.querySelectorAll('a[href*="CV_Rafael"]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.PortfolioAnalytics && window.PortfolioAnalytics.isInitialized) {
            const lang = this.href.includes('_ES.pdf') ? 'es' : 
                         this.href.includes('_EN.pdf') ? 'en' :
                         this.href.includes('_FR.pdf') ? 'fr' : 'de';
            PortfolioAnalytics.events.downloadCV(lang);
        }
    });
});

// Track clicks en proyectos
document.querySelectorAll('.project-card a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.PortfolioAnalytics && window.PortfolioAnalytics.isInitialized) {
            const projectTitle = this.closest('.project-overlay').querySelector('h4').textContent;
            PortfolioAnalytics.events.clickProject(projectTitle);
        }
    });
});

// Track clicks en redes sociales
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.PortfolioAnalytics && window.PortfolioAnalytics.isInitialized) {
            const platform = this.title || 'unknown';
            PortfolioAnalytics.events.clickSocial(platform);
        }
    });
});

// Track click en email
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.PortfolioAnalytics && window.PortfolioAnalytics.isInitialized) {
            PortfolioAnalytics.events.clickEmail();
        }
    });
});

// Track navegación por secciones
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.PortfolioAnalytics && window.PortfolioAnalytics.isInitialized) {
            const section = this.getAttribute('href').substring(1);
            PortfolioAnalytics.events.navigateSection(section);
        }
    });
});

// Console message for developers
console.log('%cRafael Mateo Portfolio', 'color: #0d6efd; font-size: 24px; font-weight: bold;');
console.log('%c🚀 Built with HTML, CSS, JavaScript, Bootstrap & jQuery', 'color: #667eea; font-size: 14px;');