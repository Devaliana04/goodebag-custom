/**
 * Goodiebag Custom - Main JavaScript
 * Handles floating scroll buttons (Batom Naik Turun), WhatsApp CTAs,
 * clean URL masking/routing, and mobile interactions.
 */

(function () {
  'use strict';

  const WA_PHONE = '6282131087971';

  // --- 1. CLEAN URL NORMALIZER ---
  // Hides .html and index from address bar if present (safe across browsers)
  function normalizeCleanUrl() {
    try {
      if (window.location.protocol === 'file:') return;
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('/index.html')) {
        const cleanPath = currentPath.replace(/\/index\.html$/, '/') || '/';
        window.history.replaceState({}, document.title, cleanPath + window.location.search + window.location.hash);
      } else if (currentPath.endsWith('.html')) {
        const cleanPath = currentPath.replace(/\.html$/, '');
        window.history.replaceState({}, document.title, cleanPath + window.location.search + window.location.hash);
      }
    } catch (e) {
      // Safe fallback for restrictive iframe or sandbox environments
    }
  }
  normalizeCleanUrl();

  // --- 2. LOCAL FILE PROTOCOL / STATIC SERVER CLEAN LINK HANDLER ---
  // Comprehensive route dictionary: clean keys mapped to actual .html files
  const ROUTE_MAP = {
    '': 'index.html',
    '/': 'index.html',
    '.': 'index.html',
    './': 'index.html',
    'index': 'index.html',
    'index.html': 'index.html',
    'beranda': 'index.html',
    'tentang': 'tentang.html',
    'produk': 'produk.html',
    'produk-seminar-workshop': 'produk-seminar-workshop.html',
    'produk/seminar-workshop': 'produk-seminar-workshop.html',
    'produk-corporate-kantor': 'produk-corporate-kantor.html',
    'produk/corporate-kantor': 'produk-corporate-kantor.html',
    'produk-event-promosi': 'produk-event-promosi.html',
    'produk/event-promosi': 'produk-event-promosi.html',
    'produk-sekolah-komunitas': 'produk-sekolah-komunitas.html',
    'produk/sekolah-komunitas': 'produk-sekolah-komunitas.html',
    'produk-pernikahan-acara': 'produk-pernikahan-acara.html',
    'produk/pernikahan-acara': 'produk-pernikahan-acara.html',
    'produk-custom': 'produk-custom.html',
    'produk/custom': 'produk-custom.html',
    'paket': 'produk.html',
    'paket-seminar-workshop': 'produk-seminar-workshop.html',
    'paket/seminar-workshop': 'produk-seminar-workshop.html',
    'paket-corporate-kantor': 'produk-corporate-kantor.html',
    'paket/corporate-kantor': 'produk-corporate-kantor.html',
    'paket-event-promosi': 'produk-event-promosi.html',
    'paket/event-promosi': 'produk-event-promosi.html',
    'paket-sekolah-komunitas': 'produk-sekolah-komunitas.html',
    'paket/sekolah-komunitas': 'produk-sekolah-komunitas.html',
    'paket-pernikahan-acara': 'produk-pernikahan-acara.html',
    'paket/pernikahan-acara': 'produk-pernikahan-acara.html',
    'paket-custom': 'produk-custom.html',
    'paket/custom': 'produk-custom.html',
    'goodie-bag-custom-seminar': 'goodie-bag-custom-seminar.html',
    'tote-bag-custom-seminar': 'tote-bag-custom-seminar.html',
    'goodie-bag-seminar': 'goodie-bag-custom-seminar.html',
    'goodie-bag-custom-perusahaan': 'goodie-bag-custom-perusahaan.html',
    'goodie-bag-perusahaan': 'goodie-bag-custom-perusahaan.html',
    'goodie-bag-custom-event': 'goodie-bag-custom-event.html',
    'goodie-bag-promosi': 'goodie-bag-custom-event.html',
    'souvenir-goodie-bag-pernikahan': 'souvenir-goodie-bag-pernikahan.html',
    'produsen-goodie-bag-custom': 'produsen-goodie-bag-custom.html',
    'goodie-bag-custom': 'produk.html',
    'portofolio': 'portofolio.html',
    'blog': 'blog.html',
    'blog-panduan-goodiebag': 'blog-panduan-goodiebag.html',
    'blog/panduan-goodiebag': 'blog-panduan-goodiebag.html',
    'blog-panduan-goodie-bag': 'blog-panduan-goodiebag.html',
    'blog/panduan-goodie-bag': 'blog-panduan-goodiebag.html',
    'blog-jenis-bahan-goodiebag': 'blog-jenis-bahan-goodiebag.html',
    'blog/jenis-bahan-goodiebag': 'blog-jenis-bahan-goodiebag.html',
    'blog-jenis-bahan-goodie-bag': 'blog-jenis-bahan-goodiebag.html',
    'blog/jenis-bahan-goodie-bag': 'blog-jenis-bahan-goodiebag.html',
    'blog-ide-isi-goodiebag-seminar': 'blog-ide-isi-goodiebag-seminar.html',
    'blog/ide-isi-goodiebag-seminar': 'blog-ide-isi-goodiebag-seminar.html',
    'blog-ide-isi-goodie-bag-seminar': 'blog-ide-isi-goodiebag-seminar.html',
    'blog/ide-isi-goodie-bag-seminar': 'blog-ide-isi-goodiebag-seminar.html',
    'blog-panduan-totebag': 'blog-panduan-goodiebag.html',
    'blog/panduan-totebag': 'blog-panduan-goodiebag.html',
    'blog-jenis-bahan-totebag': 'blog-jenis-bahan-goodiebag.html',
    'blog/jenis-bahan-totebag': 'blog-jenis-bahan-goodiebag.html',
    'blog-ide-isi-totebag-seminar': 'blog-ide-isi-goodiebag-seminar.html',
    'blog/ide-isi-totebag-seminar': 'blog-ide-isi-goodiebag-seminar.html',
    'kontak': 'kontak.html',
    'faq': 'faq.html',
    'cara-pesan': 'cara-pesan.html',
    'kebijakan-privasi': 'kebijakan-privasi.html',
    'syarat-ketentuan': 'syarat-ketentuan.html'
  };

  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const rawHref = anchor.getAttribute('href');
    if (!rawHref) return;

    // Skip hash anchors, external links, whatsapp, phone, email
    if (
      rawHref.startsWith('#') ||
      rawHref.startsWith('http://') ||
      rawHref.startsWith('https://') ||
      rawHref.startsWith('//') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:')
    ) {
      return;
    }

    // Normalize href: strip leading/trailing slashes, ./ and file extensions
    let cleanKey = rawHref.split('?')[0].split('#')[0].trim();
    if (cleanKey.startsWith('./')) cleanKey = cleanKey.substring(2);
    if (cleanKey.startsWith('/')) cleanKey = cleanKey.substring(1);
    if (cleanKey.endsWith('/')) cleanKey = cleanKey.slice(0, -1);
    if (cleanKey.endsWith('.html')) cleanKey = cleanKey.replace(/\.html$/, '');

    const targetFile = ROUTE_MAP[cleanKey] || (cleanKey ? cleanKey + '.html' : 'index.html');
    const queryPart = rawHref.includes('?') ? '?' + rawHref.split('?')[1].split('#')[0] : '';
    const hashPart = rawHref.includes('#') ? '#' + rawHref.split('#')[1] : '';

    // Prevent ERR_FILE_NOT_FOUND or 404 across local file protocol, Live Server, and static servers.
    // Clean URL will be immediately masked in the address bar by normalizeCleanUrl().
    e.preventDefault();
    window.location.href = targetFile + queryPart + hashPart;
  });

  // --- 3. FLOATING SCROLL BUTTONS ("BATOM NAIK TURUN") ---
  const btnScrollTop = document.getElementById('btnScrollTop');
  const btnScrollBottom = document.getElementById('btnScrollBottom');
  const siteHeader = document.querySelector('.site-header');

  let isScrollTicking = false;

  function updateScrollVisuals() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header shadow
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Button Naik (Scroll to Top) - visible after 200px scroll
    if (btnScrollTop) {
      if (scrollY > 200) {
        btnScrollTop.classList.add('visible');
      } else {
        btnScrollTop.classList.remove('visible');
      }
    }

    // Button Turun (Scroll to Bottom) - visible until near bottom
    if (btnScrollBottom) {
      if (scrollY === 0) {
        btnScrollBottom.classList.add('visible');
      } else {
        const windowH = window.innerHeight;
        const docH = document.documentElement.scrollHeight || document.body.scrollHeight;
        const distFromBottom = docH - (scrollY + windowH);
        if (distFromBottom > 250) {
          btnScrollBottom.classList.add('visible');
        } else {
          btnScrollBottom.classList.remove('visible');
        }
      }
    }

    isScrollTicking = false;
  }

  function onScroll() {
    if (!isScrollTicking) {
      isScrollTicking = true;
      window.requestAnimationFrame(updateScrollVisuals);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Delay initial scroll state until idle to prevent blocking initial render
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(updateScrollVisuals);
  } else {
    setTimeout(updateScrollVisuals, 500);
  }

  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (btnScrollBottom) {
    btnScrollBottom.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    });
  }

  // --- 4. WHATSAPP LINK ENCODER & BUILDER ---
  window.openGoodiebagCustomWhatsApp = function (message) {
    const text = message || 'Halo Goodiebag Custom, saya ingin konsultasi kebutuhan tote bag custom.';
    const url = 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Attach listener to consultation forms if present
  const waForm = document.getElementById('quickWaForm');
  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = (document.getElementById('formNama') || {}).value || '';
      const acara = (document.getElementById('formAcara') || {}).value || '';
      const jumlah = (document.getElementById('formJumlah') || {}).value || '';
      const bahan = (document.getElementById('formBahan') || {}).value || 'Belum pasti';
      const catatan = (document.getElementById('formCatatan') || {}).value || '-';

      let msg = `Halo Goodiebag Custom, saya ingin meminta penawaran tote bag custom:\n`;
      if (nama) msg += `• Nama: ${nama}\n`;
      if (acara) msg += `• Jenis Acara: ${acara}\n`;
      if (jumlah) msg += `• Estimasi Jumlah: ${jumlah} pcs\n`;
      if (bahan) msg += `• Pilihan Bahan: ${bahan}\n`;
      if (catatan && catatan !== '-') msg += `• Catatan: ${catatan}\n`;

      window.openGoodiebagCustomWhatsApp(msg);
    });
  }

  // --- 5. ZERO-DEPENDENCY NAVBAR COLLAPSE & DROPDOWN ---
  function initNavbarCollapse() {
    document.addEventListener('click', function (e) {
      // 1. Mobile Navbar Hamburger Toggler
      const toggler = e.target.closest('[data-bs-toggle="collapse"]');
      if (toggler) {
        e.preventDefault();
        e.stopPropagation();
        const targetSel = toggler.getAttribute('data-bs-target') || toggler.getAttribute('href');
        const target = targetSel ? document.querySelector(targetSel) : null;
        if (target) {
          const isShown = target.classList.toggle('show');
          toggler.setAttribute('aria-expanded', isShown ? 'true' : 'false');
          toggler.classList.toggle('active', isShown);
        }
        return;
      }

      // 2. Dropdown menu toggle (click on trigger or toggle button)
      const dropdownToggle = e.target.closest('[data-bs-toggle="dropdown"], .btn-dropdown-trigger, .dropdown-toggle-split');
      if (dropdownToggle) {
        e.preventDefault();
        e.stopPropagation();
        const parent = dropdownToggle.closest('.dropdown');
        const menu = parent ? parent.querySelector('.dropdown-menu') : null;
        if (menu) {
          const isShown = menu.classList.contains('show');
          // Close all other dropdowns
          document.querySelectorAll('.dropdown-menu.show').forEach(m => {
            if (m !== menu) m.classList.remove('show');
          });
          document.querySelectorAll('.dropdown.show').forEach(d => {
            if (d !== parent) d.classList.remove('show');
          });
          document.querySelectorAll('[aria-expanded="true"]').forEach(t => {
            if (t !== dropdownToggle) t.setAttribute('aria-expanded', 'false');
          });

          if (isShown) {
            menu.classList.remove('show');
            if (parent) parent.classList.remove('show');
            dropdownToggle.setAttribute('aria-expanded', 'false');
          } else {
            menu.classList.add('show');
            if (parent) parent.classList.add('show');
            dropdownToggle.setAttribute('aria-expanded', 'true');
          }
        }
        return;
      }

      // 3. Regular nav link or dropdown item clicked: close mobile menu
      const navLink = e.target.closest('.navbar-nav .nav-link:not(.dropdown-toggle), .dropdown-item');
      if (navLink) {
        const collapse = document.querySelector('.navbar-collapse.show');
        if (collapse) {
          collapse.classList.remove('show');
          const togglerBtn = document.querySelector('[data-bs-toggle="collapse"]');
          if (togglerBtn) {
            togglerBtn.setAttribute('aria-expanded', 'false');
            togglerBtn.classList.remove('active');
          }
        }
        return;
      }

      // 4. Click outside site header: close any open collapse and dropdown
      if (!e.target.closest('.site-header')) {
        const collapse = document.querySelector('.navbar-collapse.show');
        if (collapse) {
          collapse.classList.remove('show');
          const togglerBtn = document.querySelector('[data-bs-toggle="collapse"]');
          if (togglerBtn) {
            togglerBtn.setAttribute('aria-expanded', 'false');
            togglerBtn.classList.remove('active');
          }
        }
        document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('[data-bs-toggle="dropdown"][aria-expanded="true"]').forEach(t => t.setAttribute('aria-expanded', 'false'));
      }
    });
  }
  initNavbarCollapse();

  // --- 5B. HORIZONTAL SLIDERS CONTROLLER (GAYA GESER KEKIRI & KEKANAN) ---
  function initSliders() {
    const containers = document.querySelectorAll('.slider-container');
    containers.forEach(function (container) {
      const track = container.querySelector('.slider-track');
      const btnPrev = container.querySelector('.btn-slider-prev');
      const btnNext = container.querySelector('.btn-slider-next');
      if (!track) return;

      function updateButtonStates() {
        if (!btnPrev && !btnNext) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const currentScroll = track.scrollLeft;

        if (btnPrev) {
          btnPrev.disabled = currentScroll <= 4;
        }
        if (btnNext) {
          btnNext.disabled = currentScroll >= maxScroll - 4;
        }
      }

      function getStep() {
        const firstItem = track.querySelector('.slider-item, .slider-item-history');
        if (firstItem) {
          return firstItem.offsetWidth + 20; // item width + gap
        }
        return 340;
      }

      if (btnPrev) {
        btnPrev.addEventListener('click', function (e) {
          e.preventDefault();
          const step = getStep();
          track.scrollBy({ left: -step, behavior: 'smooth' });
        });
      }

      if (btnNext) {
        btnNext.addEventListener('click', function (e) {
          e.preventDefault();
          const step = getStep();
          track.scrollBy({ left: step, behavior: 'smooth' });
        });
      }

      track.addEventListener('scroll', updateButtonStates, { passive: true });
      setTimeout(updateButtonStates, 150);
    });
  }

  // --- 6. CATALOG FILTER (IF PRESENT ON PAKET PAGE) ---
  const filterButtons = document.querySelectorAll('[data-filter]');
  const packageCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length && packageCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active', 'btn-primary-brand'));
        filterButtons.forEach(b => b.classList.add('btn-secondary-brand'));
        this.classList.remove('btn-secondary-brand');
        this.classList.add('active', 'btn-primary-brand');

        const filterValue = this.getAttribute('data-filter');
        packageCards.forEach(function (card) {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.closest('.col-12').style.display = '';
          } else {
            card.closest('.col-12').style.display = 'none';
          }
        });
      });
    });
  }

  // --- 7. HERO BACKGROUND VIDEO CONTROLS ---
  const heroVideo = document.getElementById('heroVideo');
  const btnToggleVideo = document.getElementById('btnToggleVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    const playVid = function () {
      const p = heroVideo.play();
      if (p !== undefined) {
        p.catch(function () {
          // Autoplay policy fallback: start on any initial tap/click
          const resumeOnTouch = function () {
            heroVideo.play();
            window.removeEventListener('click', resumeOnTouch);
            window.removeEventListener('touchstart', resumeOnTouch);
            window.removeEventListener('scroll', resumeOnTouch);
          };
          window.addEventListener('click', resumeOnTouch, { once: true, passive: true });
          window.addEventListener('touchstart', resumeOnTouch, { once: true, passive: true });
          window.addEventListener('scroll', resumeOnTouch, { once: true, passive: true });
        });
      }
    };
    playVid();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', playVid);
    }
    window.addEventListener('load', playVid);

    if (btnToggleVideo) {
      btnToggleVideo.addEventListener('click', function () {
        if (heroVideo.paused) {
          heroVideo.play().then(function () {
            btnToggleVideo.innerHTML = '❚❚';
            btnToggleVideo.setAttribute('aria-label', 'Jeda video latar');
          }).catch(function () {});
        } else {
          heroVideo.pause();
          btnToggleVideo.innerHTML = '▶';
          btnToggleVideo.setAttribute('aria-label', 'Putar video latar');
        }
      });
    }
  }

  // --- 8. HEEL THEORY INSPIRED 3D MOUSE PARALLAX TILT ON HERO GLASS CARD ---
  const heroSection = document.querySelector('.hero-video-section');
  const heroGlassCard = document.querySelector('.hero-glass-card');
  if (heroSection && heroGlassCard && window.innerWidth >= 992) {
    heroSection.addEventListener('mousemove', function (e) {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = -y * 14;
      const tiltY = x * 14;
      heroGlassCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.02)`;
    });
    heroSection.addEventListener('mouseleave', function () {
      heroGlassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // --- 9. MILESTONE COUNTER ANIMATION ---
  function animateMilestoneNumber(el) {
    var targetAttr = el.getAttribute('data-target');
    var target = targetAttr ? parseInt(targetAttr, 10) : parseInt(el.textContent.replace(/\D/g, ''), 10);
    var rawText = el.textContent.trim();
    var suffix = el.getAttribute('data-suffix');
    if (suffix === null) {
      suffix = rawText.includes('%') ? '%' : (rawText.includes('+') ? '+' : '');
    }
    if (isNaN(target)) return;

    var duration = 1400;
    var startTime = performance.now();

    function update(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easeProgress = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(easeProgress * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  function initMilestoneCounter() {
    var milestoneNumbers = document.querySelectorAll('.milestone-number');
    if (!milestoneNumbers.length) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        animateMilestoneNumber(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    milestoneNumbers.forEach(function (el) {
      observer.observe(el);
      // Mobile tap / click interaction
      var item = el.closest('.milestone-item');
      if (item) {
        item.addEventListener('click', function () {
          animateMilestoneNumber(el);
        });
      }
    
  // Client Board Filter Buttons (Tentang Kami)
  const clientFilterBtns = document.querySelectorAll('.filter-client-btn');
  const clientBoardItems = document.querySelectorAll('.client-board-item');
  if (clientFilterBtns.length > 0 && clientBoardItems.length > 0) {
    clientFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        clientFilterBtns.forEach(b => {
          b.classList.remove('active', 'btn-warning-brand');
          b.classList.add('btn-outline-dark');
        });
        this.classList.add('active', 'btn-warning-brand');
        this.classList.remove('btn-outline-dark');

        const filter = this.getAttribute('data-client-filter');
        clientBoardItems.forEach(item => {
          const cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            setTimeout(() => { item.style.opacity = '1'; }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }


  // Robust Navbar Split Caret Toggle & Universal Click Delegation
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.btn-dropdown-trigger, .dropdown-toggle-split');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      const parentDropdown = trigger.closest('.dropdown');
      if (!parentDropdown) return;
      const menu = parentDropdown.querySelector('.dropdown-menu');
      if (!menu) return;

      const isExpanded = trigger.getAttribute('aria-expanded') === 'true' || menu.classList.contains('show');

      // Close all other open dropdowns
      document.querySelectorAll('.navbar-nav .dropdown-menu.show').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });
      document.querySelectorAll('.btn-dropdown-trigger, .dropdown-toggle-split').forEach(b => {
        if (b !== trigger) b.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.navbar-nav .dropdown.show').forEach(d => {
        if (d !== parentDropdown) d.classList.remove('show');
      });

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        parentDropdown.classList.remove('show');
        menu.classList.remove('show');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        parentDropdown.classList.add('show');
        menu.classList.add('show');
      }
      return;
    }

    // Close any open dropdown when clicking outside
    if (!e.target.closest('.navbar-nav')) {
      document.querySelectorAll('.btn-dropdown-trigger, .dropdown-toggle-split').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.navbar-nav .dropdown.show').forEach(d => {
        d.classList.remove('show');
      });
      document.querySelectorAll('.navbar-nav .dropdown-menu.show').forEach(m => {
        m.classList.remove('show');
      });
    }
  });
});