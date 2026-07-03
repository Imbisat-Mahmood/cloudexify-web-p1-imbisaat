// ============================================
// SKELETON LOADER
// ============================================
window.addEventListener('load', () => {
  const loader = document.getElementById('skeletonLoader');
  setTimeout(() => loader.classList.add('hidden'), 400);
});

// ============================================
// THEME TOGGLE (Signature Feature — saved with localStorage)
// ============================================
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================
// HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isActive = navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isActive);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// SMOOTH SCROLL + ACTIVE NAV HIGHLIGHT (Bonus)
// ============================================
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle('active', link.dataset.nav === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

// ============================================
// SCROLL PROGRESS BAR (Bonus)
// ============================================
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';
}

// ============================================
// BACK TO TOP (Bonus)
// ============================================
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateBackToTop();
}, { passive: true });

// ============================================
// TYPEWRITER HERO INTRO (Signature Feature)
// ============================================
const phrases = [
  'full-stack web apps.',
  'AI voice systems.',
  'mobile experiences.',
  'ML-powered tools.'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 70;

  if (!isDeleting && charIndex === current.length) {
    delay = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

// ============================================
// SCROLL-TRIGGERED SKILL BARS (Signature Feature)
// ============================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.fill');
      const percent = entry.target.dataset.percent / 100;
      fill.style.transform = `scaleX(${percent})`;
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill').forEach(el => skillObserver.observe(el));

// ============================================
// LIVE PROJECT FILTER (Signature Feature)
// ============================================
const filterBar = document.getElementById('filterBar');
const projectCards = document.querySelectorAll('.project-card');
const noResults = document.getElementById('noResults');

filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const filter = btn.dataset.filter;
  let visibleCount = 0;

  projectCards.forEach(card => {
    const tags = card.dataset.tags.split(',');
    const match = filter === 'all' || tags.includes(filter);
    card.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });

  noResults.hidden = visibleCount !== 0;
});

// ============================================
// PROJECT CARD TILT EFFECT
// ============================================
projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ============================================
// CONTACT FORM VALIDATION
// ============================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
  email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
  message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
};

function validateField(key) {
  const { el, error } = fields[key];
  const value = el.value.trim();
  let message = '';

  if (key === 'name' && value === '') message = 'Please enter your name.';
  if (key === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '') message = 'Please enter your email.';
    else if (!emailPattern.test(value)) message = 'Please enter a valid email address.';
  }
  if (key === 'message' && value === '') message = 'Please enter a message.';

  error.textContent = message;
  el.classList.toggle('invalid', message !== '');
  return message === '';
}

Object.keys(fields).forEach(key => {
  fields[key].el.addEventListener('blur', () => validateField(key));
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const validations = Object.keys(fields).map(validateField);
  const allValid = validations.every(Boolean);

  if (!allValid) return;

  // No backend yet — show a success state (per project guide, Month 2 adds backend)
  formSuccess.hidden = false;
  contactForm.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid'));
  contactForm.reset();

  setTimeout(() => { formSuccess.hidden = true; }, 5000);
});

// ============================================
// HIDDEN EASTER EGG — Konami Code
// ============================================
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];
let konamiProgress = 0;

const easterEgg = document.getElementById('easterEgg');
const closeEasterEgg = document.getElementById('closeEasterEgg');

document.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

  if (key === konamiSequence[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === konamiSequence.length) {
      easterEgg.hidden = false;
      konamiProgress = 0;
    }
  } else {
    konamiProgress = key === konamiSequence[0] ? 1 : 0;
  }
});

closeEasterEgg.addEventListener('click', () => {
  easterEgg.hidden = true;
});

easterEgg.addEventListener('click', (e) => {
  if (e.target === easterEgg) easterEgg.hidden = true;
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealTargets = document.querySelectorAll(
  '.about-text, .timeline, .skill-group, .project-card, .contact-form, .contact-side, .section-eyebrow, .section-title'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));