/* =========================================
   ZYNEX TECH — JavaScript
   ========================================= */

'use strict';

/* ========== NAVBAR ========== */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const hamburgerIcon= document.getElementById('hamburger-icon');
const mobileMenu   = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  // Scrolled style
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  updateActiveNav();

  // Reveal on scroll
  revealElements();

  // Back to top button
  const btt = document.getElementById('back-to-top');
  if (window.scrollY > 400) {
    btt.classList.remove('hidden');
  } else {
    btt.classList.add('hidden');
  }
});

hamburger.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  hamburgerIcon.className = isOpen ? 'fas fa-bars text-lg' : 'fas fa-times text-lg';
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamburgerIcon.className = 'fas fa-bars text-lg';
  });
});


/* ========== ACTIVE NAV LINK ========== */
function updateActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav .nav-link');
  let currentId   = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      currentId = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}


/* ========== SCROLL REVEAL ========== */
function revealElements() {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el, idx) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      // Stagger delay per row of 3
      el.style.transitionDelay = `${(idx % 4) * 0.08}s`;
      el.classList.add('visible');
    }
  });
}

// Run once on load
document.addEventListener('DOMContentLoaded', () => {
  revealElements();
  updateActiveNav();
  initCounters();
  initSkillBars();
  initPortfolioFilter();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
});


/* ========== COUNTER ANIMATION ========== */
function initCounters() {
  let triggered = false;

  const statsSection = document.querySelector('.counter')?.closest('section');
  if (!statsSection) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      document.querySelectorAll('.counter').forEach(counter => {
        const target   = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const step     = target / (duration / 16);
        let current    = 0;

        const tick = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(tick);
          }
          counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
      });
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(statsSection);
}


/* ========== SKILL BARS ========== */
function initSkillBars() {
  let triggered = false;
  const about = document.getElementById('about');
  if (!about) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      document.querySelectorAll('.skill-bar').forEach(bar => {
        const w = bar.dataset.width || '0';
        // Small delay for a staggered feel
        requestAnimationFrame(() => {
          bar.style.width = w + '%';
        });
      });
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(about);
}


/* ========== PORTFOLIO FILTER ========== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.display   = '';
          item.style.opacity   = '1';
          item.style.transform = '';
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}


/* ========== CONTACT FORM ========== */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('submit-btn');
  const toast  = document.getElementById('toast');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('[required]');
    let valid    = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = 'rgba(239,68,68,0.6)';
      } else {
        input.style.borderColor = '';
      }
    });
    if (!valid) return;

    // Loading state
    btn.disabled     = true;
    btn.innerHTML    = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending…';

    // Simulate network request
    setTimeout(() => {
      btn.disabled  = false;
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
      form.reset();

      // Show toast
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 4500);
    }, 1600);
  });

  // Remove red border on input
  form.querySelectorAll('[required]').forEach(input => {
    input.addEventListener('input', () => { input.style.borderColor = ''; });
  });
}


/* ========== BACK TO TOP ========== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ========== SMOOTH SCROLL (fallback) ========== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
