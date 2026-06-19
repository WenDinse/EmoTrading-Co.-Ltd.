(function () {
  'use strict';

  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const reveals = document.querySelectorAll('.reveal');
  const cursorGlow = document.getElementById('cursorGlow');

  /* Header scroll state */
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  /* Active nav link */
  function updateActiveNav() {
    let current = '';
    const offset = header.offsetHeight + 20;

    sections.forEach(function (section) {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* Mobile nav toggle */
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* Close mobile nav on link click */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Smooth scroll offset for sticky header */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.offsetTop - header.offsetHeight - 10;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* Intersection Observer for reveal animations */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* Cursor glow effect (desktop) */
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(function () {
          cursorGlow.style.left = mouseX + 'px';
          cursorGlow.style.top = mouseY + 'px';
          rafId = null;
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
