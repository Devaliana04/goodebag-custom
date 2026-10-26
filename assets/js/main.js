/**
 * Goodebag Custom - Main JavaScript
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
    'paket': 'paket.html',
    'paket-seminar-workshop': 'paket-seminar-workshop.html',
    'paket/seminar-workshop': 'paket-seminar-workshop.html',
    'paket-corporate-kantor': 'paket-corporate-kantor.html',
    'paket/corporate-kantor': 'paket-corporate-kantor.html',
    'paket-event-promosi': 'paket-event-promosi.html',
    'paket/event-promosi': 'paket-event-promosi.html',
    'paket-sekolah-komunitas': 'paket-sekolah-komunitas.html',
    'paket/sekolah-komunitas': 'paket-sekolah-komunitas.html',
    'paket-pernikahan-acara': 'paket-pernikahan-acara.html',
    'paket/pernikahan-acara': 'paket-pernikahan-acara.html',
    'paket-custom': 'paket-custom.html',
    'paket/custom': 'paket-custom.html',
    'portofolio': 'portofolio.html',
    'blog': 'blog.html',
    'blog-panduan-goodie-bag': 'blog-panduan-goodie-bag.html',
    'blog/panduan-goodie-bag': 'blog-panduan-goodie-bag.html',
    'blog-jenis-bahan-goodie-bag': 'blog-jenis-bahan-goodie-bag.html',
    'blog/jenis-bahan-goodie-bag': 'blog-jenis-bahan-goodie-bag.html',
    'blog-ide-isi-goodie-bag-seminar': 'blog-ide-isi-goodie-bag-seminar.html',
    'blog/ide-isi-goodie-bag-seminar': 'blog-ide-isi-goodie-bag-seminar.html',
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
  window.openGoodebagWhatsApp = function (message) {
    const text = message || 'Halo Goodebag, saya ingin konsultasi kebutuhan goodie bag custom.';
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

      let msg = `Halo Goodebag, saya ingin meminta penawaran goodie bag custom:\n`;
      if (nama) msg += `• Nama: ${nama}\n`;
      if (acara) msg += `• Jenis Acara: ${acara}\n`;
      if (jumlah) msg += `• Estimasi Jumlah: ${jumlah} pcs\n`;
      if (bahan) msg += `• Pilihan Bahan: ${bahan}\n`;
      if (catatan && catatan !== '-') msg += `• Catatan: ${catatan}\n`;

      window.openGoodebagWhatsApp(msg);
    });
  }

  // --- 5. ZERO-DEPENDENCY NAVBAR COLLAPSE & DROPDOWN ---
  document.addEventListener('click', function (e) {
    // 1. Navbar hamburger toggle
    const toggler = e.target.closest('[data-bs-toggle="collapse"]');
    if (toggler) {
      const targetSel = toggler.getAttribute('data-bs-target');
      const target = targetSel ? document.querySelector(targetSel) : null;
      if (target) {
        target.classList.toggle('show');
        const isShown = target.classList.contains('show');
        toggler.setAttribute('aria-expanded', isShown ? 'true' : 'false');
      }
      return;
    }

    // 2. Dropdown menu toggle
    const dropdownToggle = e.target.closest('[data-bs-toggle="dropdown"]');
    if (dropdownToggle) {
      e.preventDefault();
      const parent = dropdownToggle.closest('.dropdown');
      const menu = parent ? parent.querySelector('.dropdown-menu') : dropdownToggle.nextElementSibling;
      if (menu) {
        const isShown = menu.classList.contains('show');
        document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('[data-bs-toggle="dropdown"][aria-expanded="true"]').forEach(t => t.setAttribute('aria-expanded', 'false'));
        if (!isShown) {
          menu.classList.add('show');
          dropdownToggle.setAttribute('aria-expanded', 'true');
        }
      }
      return;
    }

    // 3. Close open dropdowns when clicking outside
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
      document.querySelectorAll('[data-bs-toggle="dropdown"][aria-expanded="true"]').forEach(t => t.setAttribute('aria-expanded', 'false'));
    }

    // 4. Close mobile menu when navigating
    const navLink = e.target.closest('.navbar-nav .nav-link:not(.dropdown-toggle)');
    if (navLink) {
      const collapse = document.querySelector('.navbar-collapse.show');
      if (collapse) {
        collapse.classList.remove('show');
        const togglerBtn = document.querySelector('[data-bs-toggle="collapse"]');
        if (togglerBtn) togglerBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

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

})();
