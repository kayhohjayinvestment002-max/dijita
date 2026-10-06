(function () {
  'use strict';

  // Light / dark switch (remembers choice when storage is available)
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme');
  function setTheme(mode) {
    if (mode === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    themeBtn.setAttribute('aria-pressed', mode === 'dark');
    themeBtn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  var saved = null;
  try { saved = localStorage.getItem('dijita-theme'); } catch (e) {}
  setTheme(saved === 'dark' ? 'dark' : 'light');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('dijita-theme', next); } catch (e) {}
  });

  // Mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function toggle(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', function () {
    toggle(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') toggle(false);
  });

  // Nav shadow on scroll
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Count-up stats
  function count(el) {
    var end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = pre + Math.round(end * p) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Reveal on scroll + trigger counters
  var targets = document.querySelectorAll('.card, .case, .steps li, .grid.three > div, details');
  targets.forEach(function (t) { t.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    targets.forEach(function (t) { io.observe(t); });

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.querySelectorAll('[data-count]').forEach(count);
        co.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    co.observe(document.querySelector('.stats'));
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(count);
  }

  // Contact form -> WhatsApp 
  var WHATSAPP_NUMBER = '2348021039938';
  var form = document.getElementById('form');
  var status = document.getElementById('status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var name = (d.get('name') || '').trim(), phone = (d.get('phone') || '').trim();
    if (!name || !phone) {
      status.textContent = 'Please enter your name and phone number.';
      return;
    }
    status.textContent = '';
    var text = 'Hello DIJITA, my name is ' + name + ' (' + phone + '). I need help with: ' +
      d.get('service') + '. ' + (d.get('msg') || '').trim();
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
