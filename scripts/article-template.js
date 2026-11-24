const fs = require('fs');
const path = require('path');

// Helper to wrap article in standard template
function renderArticlePage({
  slug,
  title,
  metaTitle,
  metaDescription,
  focusKeyphrase,
  datePublished = '2026-11-24T17:00:00+07:00',
  dateModified = '2026-11-24T17:00:00+07:00',
  dateFormatted = '24 November 2026, 17:00 WIB',
  author = 'Devaliana Tensa Nanul',
  readingTime = '8 Menit',
  imagePath,
  imageAlt,
  imageCaption,
  breadcrumbs,
  tocItems,
  leadText,
  contentHtml,
  faqItems,
  relatedArticles
}) {
  const faqSchemaItems = faqItems.map(item => `{
        "@type": "Question",
        "name": ${JSON.stringify(item.q)},
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ${JSON.stringify(item.a)}
        }
      }`).join(',\n      ');

  const faqAccordionItems = faqItems.map((item, idx) => `
    <div class="accordion-item border mb-2 rounded-3">
      <h3 class="accordion-header" id="headingFaq${idx + 1}">
        <button class="accordion-button ${idx === 0 ? '' : 'collapsed'} fw-bold text-navy" type="button" data-bs-toggle="collapse"
          data-bs-target="#collapseFaq${idx + 1}" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="collapseFaq${idx + 1}">
          ${item.q}
        </button>
      </h3>
      <div id="collapseFaq${idx + 1}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" aria-labelledby="headingFaq${idx + 1}"
        data-bs-parent="#articleFaqAccordion">
        <div class="accordion-body text-secondary small" style="line-height: 1.75;">
          ${item.a}
        </div>
      </div>
    </div>`).join('\n');

  const relatedHtml = relatedArticles.map(rel => `
  <div class="col-12 col-md-6 col-lg-4">
    <div class="article-related-card h-100 border p-3 rounded-3 bg-white shadow-sm d-flex gap-3 align-items-center">
      <a href="/blog/${rel.slug}" class="related-thumb flex-shrink-0" aria-label="${rel.title}" style="width: 80px; height: 80px; border-radius: 10px; overflow: hidden; display: block;">
        <img src="${rel.image}" width="80" height="80" loading="lazy" decoding="async" alt="${rel.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </a>
      <div class="related-content">
        <span class="badge bg-light text-primary border font-xs mb-1 px-2 py-0.5 rounded-pill">${rel.category}</span>
        <h4 class="related-title h6 fw-bold mb-1"><a href="/blog/${rel.slug}" class="text-navy text-decoration-none hover-primary">${rel.title}</a></h4>
        <p class="related-desc text-muted font-xs mb-0">${rel.desc}</p>
      </div>
    </div>
  </div>`).join('\n');

  const tocHtml = tocItems.map(item => `    <li><a href="#${item.id}">${item.text}</a></li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${metaTitle} — Goodie Bag</title>
  <meta name="description" content="${metaDescription}">
  <meta name="author" content="${author}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="https://goodiebag.web.id/blog/${slug}">

  <!-- OpenGraph Metadata -->
  <meta property="og:type" content="article">
  <meta property="og:locale" content="id_ID">
  <meta property="og:site_name" content="Goodie Bag">
  <meta property="og:title" content="${metaTitle} — Goodie Bag">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:url" content="https://goodiebag.web.id/blog/${slug}">
  <meta property="og:image" content="https://goodiebag.web.id/${imagePath.replace(/^\.\.\//, '')}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${imageAlt}">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${metaTitle} — Goodie Bag">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="https://goodiebag.web.id/${imagePath.replace(/^\.\.\//, '')}">

  <!-- Favicon & Search Icon -->
  <link rel="icon" type="image/x-icon" href="../favicon.ico">
  <link rel="shortcut icon" href="../favicon.ico">
  <link rel="icon" type="image/webp" sizes="192x192" href="../assets/images/logo-icon-192.webp?v=20261104_goodiebag">
  <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/apple-touch-icon.webp?v=20261104_goodiebag">

  <!-- Web Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Bootstrap 5 CSS & Main Stylesheet -->
  <link href="../assets/css/bootstrap.min.css" rel="stylesheet">
  <link href="../assets/css/style.css?v=20261109_v1" rel="stylesheet">

  <!-- Structured Data JSON-LD Schema -->
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": [
        "Organization",
        "LocalBusiness"
      ],
      "@id": "https://goodiebag.web.id/#organization",
      "name": "Goodie Bag — Konveksi & Vendor Tas Goodiebag",
      "alternateName": [
        "Goodie Bag",
        "Goodiebag",
        "Tas Goodie Bag",
        "CV. SAUDAGAR KAYA ABADI"
      ],
      "url": "https://goodiebag.web.id",
      "logo": {
        "@type": "ImageObject",
        "url": "https://goodiebag.web.id/assets/images/logo.webp?v=20261111",
        "caption": "Logo Goodie Bag",
        "width": 532,
        "height": 392
      },
      "image": "https://goodiebag.web.id/assets/images/og-image.webp",
      "telephone": "+6282131087971",
      "priceRange": "Rp 3.500 - Rp 45.000",
      "parentOrganization": {
        "@type": "Organization",
        "name": "CV. Saudagar Kaya Abadi",
        "url": "https://www.sakasouvenir.com/"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Jl. Band. Palmerah No.D3-35B, Cemorokandang, Kec. Kedungkandang",
        "addressLocality": "Kota Malang",
        "addressRegion": "Jawa Timur",
        "postalCode": "65138",
        "addressCountry": "ID"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -7.9907544,
        "longitude": 112.6804383
      }
    },
    {
      "@type": "Article",
      "@id": "https://goodiebag.web.id/blog/${slug}#article",
      "headline": ${JSON.stringify(title)},
      "description": ${JSON.stringify(metaDescription)},
      "image": "https://goodiebag.web.id/${imagePath.replace(/^\.\.\//, '')}",
      "datePublished": "${datePublished}",
      "dateModified": "${dateModified}",
      "inLanguage": "id-ID",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://goodiebag.web.id/blog/${slug}"
      },
      "author": {
        "@type": "Person",
        "name": "${author}",
        "jobTitle": "Kepala Produksi & Desain Material",
        "url": "https://goodiebag.web.id/tentang"
      },
      "publisher": {
        "@id": "https://goodiebag.web.id/#organization"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://goodiebag.web.id/blog/${slug}#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Beranda",
          "item": "https://goodiebag.web.id"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://goodiebag.web.id/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": ${JSON.stringify(breadcrumbs)},
          "item": "https://goodiebag.web.id/blog/${slug}"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://goodiebag.web.id/blog/${slug}#faq",
      "mainEntity": [
        ${faqSchemaItems}
      ]
    }
  ]
}
  </script>
</head>

<body>
  <a class="skip-link" href="#main-content">Lewati ke konten utama</a>

  <!-- Header & Navbar -->
  <header class="site-header sticky-top">
    <nav class="navbar navbar-expand-lg" aria-label="Navigasi utama">
      <div class="container">
        <a class="navbar-brand" href="/" aria-label="Konveksi Goodie Bag Malang">
          <img src="../assets/images/logo.webp?v=20261111" alt="Logo Goodie Bag - Konveksi Goodie Bag &amp; Tas Seminar Kit Terpercaya di Malang" class="site-logo" width="54" height="48" fetchpriority="high">
        </a>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse"
          data-bs-target="#siteNav" aria-controls="siteNav" aria-expanded="false" aria-label="Buka navigasi">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="siteNav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li class="nav-item">
              <a class="nav-link" href="/">Beranda</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/tentang">Tentang</a>
            </li>
            <li class="nav-item dropdown">
              <div class="d-flex align-items-center">
                <a class="nav-link" href="/produk">Produk</a>
                <button type="button" class="btn-dropdown-trigger dropdown-toggle-split border-0 bg-transparent p-0 d-inline-flex align-items-center justify-content-center" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Buka submenu Produk" style="width: 38px; height: 38px; cursor: pointer; color: #D97706;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transition: transform 0.2s ease;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <ul class="dropdown-menu shadow-lg border-0 rounded-3">
                  <li><a class="dropdown-item fw-bold" href="/produk">Semua Katalog Goodie Bag &rarr;</a></li>
                  <li><hr class="dropdown-divider my-1"></li>
                  <li><a class="dropdown-item" href="/produk#kanvas-seminar">Goodie Bag Kanvas Seminar</a></li>
                  <li><a class="dropdown-item" href="/produk#corporate-bag">Goodie Bag Denim Corporate</a></li>
                  <li><a class="dropdown-item" href="/produk#korduroi">Goodie Bag Korduroi Premium</a></li>
                  <li><a class="dropdown-item" href="/produk#spunbond">Goodie Bag Spunbond Promosi</a></li>
                  <li><a class="dropdown-item" href="/produk#mika-pvc">Goodie Bag Mika PVC Transparan</a></li>
                  <li><a class="dropdown-item" href="/produk#blacu">Goodie Bag Blacu Katun</a></li>
                  <li><a class="dropdown-item" href="/produk#kulit-etnik">Goodie Bag Etnik Goni &amp; Tenun</a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item dropdown">
              <div class="d-flex align-items-center">
                <a class="nav-link" href="/layanan">Layanan</a>
                <button type="button" class="btn-dropdown-trigger dropdown-toggle-split border-0 bg-transparent p-0 d-inline-flex align-items-center justify-content-center" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Buka submenu Layanan" style="width: 38px; height: 38px; cursor: pointer; color: #D97706;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transition: transform 0.2s ease;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <ul class="dropdown-menu shadow-lg border-0 rounded-3">
                  <li><a class="dropdown-item fw-bold" href="/layanan">Semua Layanan Konveksi &rarr;</a></li>
                  <li><hr class="dropdown-divider my-1"></li>
                  <li><a class="dropdown-item" href="/layanan#corporate">Goodie Bag Corporate &amp; Kantor</a></li>
                  <li><a class="dropdown-item" href="/layanan#custom">Tas Custom Pola Khusus</a></li>
                  <li><a class="dropdown-item" href="/layanan#seminar">Tas Seminar Kit &amp; Diklat</a></li>
                  <li><a class="dropdown-item" href="/layanan#event">Goodie Bag Promosi &amp; Event</a></li>
                  <li><a class="dropdown-item" href="/layanan#pernikahan">Souvenir Tas Pernikahan</a></li>
                  <li><a class="dropdown-item" href="/layanan#sekolah">Tas Sekolah &amp; Komunitas</a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/portofolio">Portofolio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/blog">Blog</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/cara-pesan">Cara Pesan</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/faq">FAQ</a>
            </li>
          </ul>
          <a class="btn btn-warning-brand d-inline-flex align-items-center justify-content-center gap-2 ms-lg-3 mt-3 mt-lg-0"
            href="https://wa.me/6282131087971?text=Halo%2C%20saya%20ingin%20konsultasi%20goodie%20bag%20dari%20artikel%20${slug}."
            target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.364 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.655.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z" />
            </svg>
            Konsultasi WhatsApp
          </a>
        </div>
      </div>
    </nav>
  </header>

  <!-- Breadcrumb Navigation -->
  <nav class="breadcrumb-nav" aria-label="Breadcrumb">
    <div class="container article-detail-container">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Beranda</a></li>
        <li class="breadcrumb-item"><a href="/blog">Blog</a></li>
        <li class="breadcrumb-item active" aria-current="page">${breadcrumbs}</li>
      </ol>
    </div>
  </nav>

  <main id="main-content">
    <section class="section-padding pt-0">
      <div class="container article-detail-container">
        <div class="row g-4 g-xl-5">
          <div class="col-12">
            <article class="article-reading-canvas">
              <!-- Article Header -->
              <header class="mb-4">
                <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border text-primary font-xs fw-bold mb-3">
                  <span>Khusus Goodie Bag</span>
                  <span>•</span>
                  <span>Bagian dari <a href="https://www.sakasouvenir.com/" target="_blank" rel="noopener noreferrer" class="text-navy">sakasouvenir.com</a></span>
                </div>
                <h1 class="section-title mb-3 font-serif">${title}</h1>
                <div class="d-flex flex-wrap align-items-center gap-2 text-muted small pb-3 border-bottom">
                  <span class="d-inline-flex align-items-center gap-2">
                    <img src="../assets/images/author/devaliana-square.webp" width="28" height="28" class="rounded-circle border" alt="Devaliana Tensa Nanul" style="width:28px;height:28px;object-fit:cover;"> Penulis: <strong>${author}</strong>
                  </span>
                  <span>•</span>
                  <span>Diperbarui: <strong><time datetime="${dateModified}">${dateFormatted}</time></strong></span>
                  <span>•</span>
                  <span>Waktu Baca: <strong>${readingTime}</strong></span>
                </div>
              </header>

              <!-- Featured Image -->
              <figure class="article-image-box article-featured-box mb-4" style="max-width: 720px; margin-inline: auto;">
                <div class="img-wrap" style="background:transparent; aspect-ratio: 16/9; overflow: hidden; border-radius: 14px;">
                  <img src="${imagePath}" width="1200" height="675"
                    alt="${imageAlt}"
                    title="${title}"
                    class="img-fluid w-100 h-100 object-fit-cover"
                    loading="lazy" decoding="async">
                </div>
                <figcaption class="article-image-caption text-center small text-muted mt-2">
                  ${imageCaption}
                </figcaption>
              </figure>

              <!-- Content Body -->
              <div class="content-body" style="font-size:1.05rem;line-height:1.85;">
                <p class="lead fw-semibold text-navy">
                  ${leadText}
                </p>

                <!-- Ecosystem Banner Note -->
                <div class="p-3 bg-light rounded-3 border-start border-4 border-warning my-4">
                  <div class="d-flex align-items-start gap-2">
                    <span class="fs-5">ℹ️</span>
                    <p class="mb-0 small text-secondary">
                      <strong>Tentang Website Ini:</strong> Platform <a href="/" class="fw-bold text-navy">goodiebag.web.id</a> adalah website manufaktur terdedikasi <em>khusus untuk pembuatan dan pengadaan tas goodie bag custom</em>. Website ini merupakan unit resmi dari <strong><a href="https://www.sakasouvenir.com/" target="_blank" rel="noopener noreferrer" class="fw-bold text-navy">Saka Souvenir (sakasouvenir.com)</a> / CV. SAUDAGAR KAYA ABADI</strong>, melayani instansi, BUMN, perguruan tinggi, dan korporasi di seluruh Indonesia dengan jaminan mutu konveksi tangan pertama di Malang.
                    </p>
                  </div>
                </div>

                <!-- Table of Contents -->
                <nav class="article-toc my-4 p-3 rounded-3 bg-slate-50 border" aria-label="Daftar Isi Artikel">
                  <div class="article-toc-title fw-bold text-navy mb-2 d-flex align-items-center gap-2">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                    </svg>
                    Daftar Isi Artikel
                  </div>
                  <ul class="mb-0 ps-3 small" style="line-height: 1.8;">
${tocHtml}
                    <li><a href="#faq-section">Pertanyaan yang Sering Diajukan (FAQ)</a></li>
                    <li><a href="#kesimpulan-artikel">Kesimpulan</a></li>
                  </ul>
                </nav>

                <!-- Main Text Content -->
                ${contentHtml}

                <!-- FAQ Section -->
                <div class="my-5 pt-3" id="faq-section">
                  <h2 class="h4 fw-bold text-navy mb-3">Pertanyaan yang Sering Diajukan (FAQ)</h2>
                  <div class="accordion" id="articleFaqAccordion">
                    ${faqAccordionItems}
                  </div>
                </div>

                <!-- Related Articles Section -->
                <div class="my-5 pt-4 border-top">
                  <h3 class="h5 fw-bold text-navy mb-3">Artikel Terkait & Panduan Lanjutan</h3>
                  <div class="row g-3">
                    ${relatedHtml}
                  </div>
                </div>

                <!-- WhatsApp CTA Box -->
                <div class="p-4 bg-light rounded-4 border my-5 text-center shadow-sm">
                  <span class="badge bg-amber-100 text-amber-800 border px-3 py-1 rounded-pill small fw-bold mb-2">Konsultasi Gratis</span>
                  <h3 class="h5 fw-bold text-navy mb-2">Siap Memesan Goodie Bag Custom di Malang?</h3>
                  <p class="small text-muted mb-3 mx-auto" style="max-width: 600px;">
                    Konsultasikan kebutuhan tas seminar, merchandise kantor, atau suvenir event Anda bersama tim spesialis Goodie Bag Saka Souvenir. Dapatkan estimasi biaya, pemilihan kain, dan mockup digital 2D/3D gratis.
                  </p>
                  <div class="d-flex flex-wrap justify-content-center gap-2">
                    <a href="https://wa.me/6282131087971?text=Halo%20Goodie%20Bag%20Saka%20Souvenir%2C%20saya%20ingin%20konsultasi%20pemesanan%20tas."
                      class="btn btn-warning-brand px-4 py-2 fw-bold" target="_blank" rel="noopener noreferrer">
                      Chat via WhatsApp (+62 821-3108-7971)
                    </a>
                    <a href="/cara-pesan" class="btn btn-outline-secondary px-3 py-2 fw-bold">
                      Lihat Cara Pemesanan &rarr;
                    </a>
                  </div>
                </div>

              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="row g-4 g-lg-5">
        <div class="col-12 col-md-6 col-lg-3">
          <a href="/" aria-label="Konveksi Goodie Bag Malang"><img src="../assets/images/logo.webp?v=20261111" alt="Logo Goodie Bag - Produsen Goodie Bag &amp; Tas Seminar Kit Malang" class="footer-logo mb-3" width="54" height="48" loading="lazy"></a>
          <p class="small text-light-50 mb-3">goodiebag.web.id adalah website khusus dan sentra konveksi goodie bag custom & tas seminar kit terpercaya di Indonesia. Unit spesialis resmi dari <a href="https://www.sakasouvenir.com/" target="_blank" rel="noopener noreferrer" class="text-white text-decoration-underline">Saka Souvenir</a> (CV. SAUDAGAR KAYA ABADI).</p>
          <div class="d-flex flex-wrap">
            <span class="footer-badge d-inline-flex align-items-center gap-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#126B56" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> Mutu Terstandarisasi 100%</span>
            <span class="footer-badge d-inline-flex align-items-center gap-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#096EA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg> QC Jahitan Presisi</span>
            <span class="footer-badge d-inline-flex align-items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1" aria-hidden="true"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>Seluruh Indonesia</span>
          </div>
        </div>
        <div class="col-6 col-md-3 col-lg-2">
          <h3 class="footer-heading">Navigasi</h3>
          <ul class="footer-links">
            <li><a href="/">Beranda</a></li>
            <li><a href="/tentang">Tentang Kami</a></li>
            <li><a href="/produk">Katalog Produk</a></li>
            <li><a href="/portofolio">Portofolio</a></li>
            <li><a href="/blog">Blog &amp; Panduan</a></li>
            <li><a href="/cara-pesan">Cara Pemesanan</a></li>
            <li><a href="/kontak">Kontak Workshop</a></li>
          </ul>
        </div>
        <div class="col-6 col-md-3 col-lg-3">
          <h3 class="footer-heading">Layanan &amp; Produk</h3>
          <ul class="footer-links">
            <li><a href="/produk/seminar-workshop">Tas Seminar &amp; Workshop</a></li>
            <li><a href="/produk/corporate-kantor">Goodie Bag Kantor &amp; BUMN</a></li>
            <li><a href="/produk/event-promosi">Tas Promosi &amp; Pameran</a></li>
            <li><a href="/produk/sekolah-komunitas">Tas Sekolah &amp; Komunitas</a></li>
            <li><a href="/produk/pernikahan-acara">Souvenir Tas Pernikahan</a></li>
            <li><a href="/produk/custom">Tas Custom Bebas Desain</a></li>
          </ul>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <h3 class="footer-heading">Kontak Workshop</h3>
          <div class="footer-contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <div>
              <p class="mb-0 small text-light-50">Jl. Band. Palmerah No.D3-35B, Cemorokandang, Kec. Kedungkandang, Kota Malang, Jawa Timur 65138</p>
              <a href="https://goodiebag.web.id/kontak" target="_blank" rel="noopener noreferrer" class="small text-sky fw-semibold">Lihat di Google Maps &rarr;</a>
            </div>
          </div>
          <div class="footer-contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            <div>
              <p class="mb-0 small text-light-50">WhatsApp / Telepon: <a href="https://wa.me/6282131087971" class="text-sky fw-bold">+62 821-3108-7971</a></p>
              <span class="small text-light-50">Senin – Sabtu: 08.00 – 16.00 WIB (Minggu Tutup)</span>
            </div>
          </div>
        </div>
      </div>
      <div class="site-footer-bottom border-top border-white border-opacity-10 pt-4 mt-4 text-center">
        <div class="footer-legal-links small text-white-50">
          <span>&copy; 2026 Goodie Bag Indonesia. Hak cipta dilindungi undang-undang. Bagian dari <a href="https://www.sakasouvenir.com/" target="_blank" rel="noopener noreferrer" class="text-white-50">Saka Souvenir</a> (CV. SAUDAGAR KAYA ABADI).</span>
          <span class="mx-2 text-white-25">|</span>
          <a href="/kebijakan-privasi" class="text-white-50">Kebijakan Privasi</a>
          <span class="mx-2 text-white-25">|</span>
          <a href="/syarat-ketentuan" class="text-white-50">Syarat &amp; Ketentuan</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- WhatsApp Float Button -->
  <div class="floating-whatsapp-wrap">
    <a href="https://wa.me/6282131087971?text=Halo%20Goodie%20Bag%20Saka%20Souvenir%2C%20saya%20tertarik%20konsultasi%20pesanan%20tas."
      class="float-wa" target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp Goodie Bag">
      <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.364 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.655.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z" />
      </svg>
      <span class="float-tooltip">Chat WhatsApp</span>
    </a>
  </div>

  <script src="../assets/js/bootstrap.bundle.min.js" defer></script>
  <script src="../assets/js/main.js?v=20261107_v1" defer></script>
</body>

</html>`;
}

module.exports = { renderArticlePage };
