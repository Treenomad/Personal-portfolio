/**
   * yu个人作品集 — 交互脚本
 * Features: 导航滚动高亮、移动端菜单、滚动渐显动画、平滑滚动
 */
(function () {
  'use strict';

  // ===== DOM Elements =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // ===== Mobile Menu Toggle =====
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  navLinkEls.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ===== Navbar Scroll Effect =====
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // ===== Active Nav Highlight =====
  function updateActiveNav() {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ===== Smooth Scroll for all anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offsetTop = target.offsetTop - navbar.offsetHeight - 16;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // ===== Scroll-triggered Fade-in Animation =====
  function setupFadeIn() {
    var elements = document.querySelectorAll(
      '.project-card, .highlight-card, .contact-card, .skill-category'
    );
    elements.forEach(function (el) {
      el.classList.add('fade-in');
    });
  }

  function checkFadeIn() {
    var elements = document.querySelectorAll('.fade-in');
    var windowHeight = window.innerHeight;
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  setupFadeIn();
  checkFadeIn();
  window.addEventListener('scroll', checkFadeIn);
  window.addEventListener('resize', checkFadeIn);

  // ===== Trigger initial state =====
  updateActiveNav();

  console.log('🚀 yu的个人作品集已就绪 — https://treenomad.github.io/Personal-portfolio/');
})();
