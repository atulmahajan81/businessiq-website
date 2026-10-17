/**
 * BusinessIQ.co.in — Main JavaScript
 * © 2026 BusinessIQ.co.in. All Rights Reserved.
 */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});
// Close nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Back to Top ──
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Cookie banner ──
const cookieBanner = document.getElementById('cookieBanner');
const cookieKey = 'biq_cookie_accepted';
if (!localStorage.getItem(cookieKey)) {
  cookieBanner.classList.remove('hidden');
}
document.getElementById('acceptCookies').addEventListener('click', () => {
  localStorage.setItem(cookieKey, '1');
  cookieBanner.classList.add('hidden');
});

// ── Fade-in on scroll ──
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Brand filters ──
const filterBtns = document.querySelectorAll('.filter-btn');
const brandCards = document.querySelectorAll('.brand-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    brandCards.forEach(card => {
      const cat = card.dataset.category || '';
      const show = filter === 'all' || cat.toLowerCase().includes(filter.toLowerCase());
      card.dataset.hidden = show ? 'false' : 'true';
    });
  });
});

// ── Contact form ──
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async submit — replace with actual API call
    await new Promise(r => setTimeout(r, 1500));

    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';
  });
}

// ── Newsletter ──
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input.value) {
      input.value = '';
      input.placeholder = 'Thank you! ✓';
      setTimeout(() => { input.placeholder = 'Your email address'; }, 3000);
    }
  });
}

// ── Smooth anchor offsets (account for fixed navbar height 72px) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ── Animated counters ──
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = 'true';
      const target = parseInt(e.target.dataset.target);
      const suffix = e.target.dataset.suffix || '';
      animateCounter(e.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => statsObserver.observe(el));
