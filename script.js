// ===================================
// THEME TOGGLE FUNCTIONALITY
// ===================================
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');

    if (!themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
});

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            if (entry.target.classList.contains('stat-card')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll(
    '.about-text, .about-stats, .skill-category, .project-card, ' +
    '.timeline-item, .achievement-card, .contact-item'
);
elementsToAnimate.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Safety net: if the observer misses anything (edge cases with
// zero-height containers, very fast scrolling, etc.), force reveal
// everything after a short delay so nothing stays permanently blank.
setTimeout(() => {
    elementsToAnimate.forEach(el => el.classList.add('fade-in'));
}, 2500);

// Stat cards live inside .about-stats but need their own observer trigger too
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));

// ===================================
// COUNTER ANIMATION FOR STATS
// ===================================
function animateCounter(element) {
    const numberEl = element.querySelector('.stat-number');
    if (!numberEl || numberEl.dataset.animated === 'true') return;

    const target = parseInt(numberEl.getAttribute('data-target'), 10);
    const suffixMatch = numberEl.textContent.match(/\+/);
    const suffix = suffixMatch ? '+' : '';
    const duration = 1500;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        numberEl.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            numberEl.textContent = target + suffix;
            numberEl.dataset.animated = 'true';
        }
    }
    requestAnimationFrame(update);
}

// ===================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ===================================
// CONTACT FORM HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();

    // In a real implementation, hook this up to a backend or a service like
    // EmailJS, Formspree, or Netlify Forms.
});

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        left: auto;
        max-width: min(360px, calc(100vw - 40px));
        background: ${type === 'success' ? '#4fbf5c' : '#8b8fff'};
        color: #0a0d12;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===================================
// HERO TERMINAL BOOT SEQUENCE
// ===================================
const terminalScript = [
    { type: 'prompt', text: 'whoami' },
    { type: 'output', text: 'Yogesh Patel — Backend & Android App Developer' },
    { type: 'prompt', text: 'cat status.txt' },
    { type: 'output', text: '8.3 CGPA Till 6th Sem B.Tech CSE' },
    { type: 'output', text: 'Intern @ ApexPlanet Software' },
    { type: 'prompt', text: './run.sh --stack' },
    { type: 'output', text: 'Java · Spring Boot · DSA · MySQL' },
    { type: 'prompt', text: 'echo $STATUS' },
    { type: 'success', text: 'BUILD SUCCESSFUL — open to internships' }
];

function typeTerminal() {
    const container = document.getElementById('terminalContent');
    if (!container) return;

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineEl = null;

    function nextLine() {
        if (lineIndex >= terminalScript.length) {
            const cursor = document.createElement('span');
            cursor.className = 'term-cursor';
            const wrapper = document.createElement('div');
            wrapper.className = 'term-line';
            const promptSpan = document.createElement('span');
            promptSpan.className = 'term-prompt';
            promptSpan.textContent = '$ ';
            wrapper.appendChild(promptSpan);
            wrapper.appendChild(cursor);
            container.appendChild(wrapper);
            return;
        }

        const line = terminalScript[lineIndex];
        currentLineEl = document.createElement('div');
        currentLineEl.className = 'term-line';

        if (line.type === 'prompt') {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'term-prompt';
            promptSpan.textContent = '$ ';
            currentLineEl.appendChild(promptSpan);
        } else if (line.type === 'success') {
            currentLineEl.classList.add('term-output');
            currentLineEl.style.color = 'var(--mint-500)';
        } else {
            currentLineEl.classList.add('term-output');
        }

        container.appendChild(currentLineEl);
        charIndex = 0;
        typeChar(line.text);
    }

    function typeChar(text) {
        const speed = 28;
        if (charIndex < text.length) {
            currentLineEl.append(text.charAt(charIndex));
            charIndex++;
            setTimeout(() => typeChar(text), speed);
        } else {
            lineIndex++;
            setTimeout(nextLine, lineIndex < terminalScript.length && terminalScript[lineIndex - 1].type === 'prompt' ? 150 : 350);
        }
    }

    nextLine();
}

// ===================================
// HERO SUBTITLE TYPEWRITER (rotating roles)
// ===================================
function typeHeroSubtitle() {
    const el = document.getElementById('heroSubtitle');
    if (!el) return;

    const phrases = [
        'Java Backend Developer',
        'Spring Boot Engineer',
        'DSA Enthusiast',
        'Android Developer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        const current = phrases[phraseIndex];
        if (!deleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(tick, 1600);
                return;
            }
        } else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }
        setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
}

document.addEventListener('DOMContentLoaded', () => {
    typeTerminal();
    typeHeroSubtitle();
});

// ===================================
// DYNAMIC YEAR IN FOOTER
// ===================================
const yearElements = document.querySelectorAll('.footer-bottom p');
if (yearElements.length > 0) {
    const currentYear = new Date().getFullYear();
    yearElements[0].innerHTML = yearElements[0].innerHTML.replace('2025', currentYear);
}

// ===================================
// PERFORMANCE: Debounce scroll events
// ===================================
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

const debouncedScroll = debounce(() => {}, 100);
window.addEventListener('scroll', debouncedScroll);

// ===================================
// CONSOLE MESSAGE (Easter Egg)
// ===================================
console.log('%c👋 Hey there!', 'font-size: 20px; font-weight: bold; color: #ffb454;');
console.log('%cLooking at the code? I like your curiosity!', 'font-size: 14px; color: #8792a6;');
console.log('%cFeel free to reach out if you want to discuss this project or collaborate!', 'font-size: 14px; color: #8792a6;');