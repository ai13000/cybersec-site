/* ═══════════════════════════════════════════════════════════
   SECUREFORGE — INTERACTIONS
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Nav scroll state ───────────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Active nav link tracking ───────────────────────────── */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      // Map section IDs to nav hrefs
      if (
        (href === 'home'    && (current === 'home' || current === '')) ||
        (href === 'about'   && current === 'about') ||
        (href === 'services' && current === 'services') ||
        (href === 'contact' && (current === 'contact' || current === 'proof'))
      ) {
        link.classList.add('active');
      }
    });
  }

  /* ── Hamburger menu ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    navMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── Scroll reveal (Intersection Observer) ──────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger siblings within the same parent
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.revealed)'));
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 80, 320);

            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal all immediately
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ── Process step — animated timeline drawing ───────────── */
  const connectors = document.querySelectorAll('.process-connector span');

  if ('IntersectionObserver' in window && connectors.length) {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.transition = 'width 0.6s cubic-bezier(0.16,1,0.3,1), height 0.6s cubic-bezier(0.16,1,0.3,1)';
            entry.target.style.background = 'var(--navy)';
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );
    connectors.forEach(c => lineObserver.observe(c));
  }

  /* ── Service card keyboard support ─────────────────────── */
  document.querySelectorAll('.service-card[tabindex="0"]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = card.querySelector('.service-link');
        if (link) link.click();
      }
    });
  });

  /* ── Smooth scroll polyfill for anchor clicks ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 110; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Hero entrance animation ─────────────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(24px)';
    heroContent.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      });
    });
  }

})();
