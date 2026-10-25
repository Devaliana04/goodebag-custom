import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
print(f"Found {len(html_files)} HTML files to update.")

replacements = [
    # Assets relative paths
    (r'href="/assets/', r'href="assets/'),
    (r'src="/assets/', r'src="assets/'),
    
    # Internal routes without leading slash
    (r'href="/"', r'href="./"'),
    (r'href="/tentang"', r'href="tentang"'),
    (r'href="/paket"', r'href="paket"'),
    (r'href="/paket/seminar-workshop"', r'href="paket-seminar-workshop"'),
    (r'href="/paket/corporate-kantor"', r'href="paket-corporate-kantor"'),
    (r'href="/paket/event-promosi"', r'href="paket-event-promosi"'),
    (r'href="/paket/sekolah-komunitas"', r'href="paket-sekolah-komunitas"'),
    (r'href="/paket/pernikahan-acara"', r'href="paket-pernikahan-acara"'),
    (r'href="/paket/custom"', r'href="paket-custom"'),
    (r'href="/portofolio"', r'href="portofolio"'),
    (r'href="/blog"', r'href="blog"'),
    (r'href="/blog/panduan-goodie-bag"', r'href="blog-panduan-goodie-bag"'),
    (r'href="/blog/jenis-bahan-goodie-bag"', r'href="blog-jenis-bahan-goodie-bag"'),
    (r'href="/blog/ide-isi-goodie-bag-seminar"', r'href="blog-ide-isi-goodie-bag-seminar"'),
    (r'href="/kontak"', r'href="kontak"'),
    (r'href="/faq"', r'href="faq"'),
    (r'href="/cara-pesan"', r'href="cara-pesan"'),
    (r'href="/kebijakan-privasi"', r'href="kebijakan-privasi"'),
    (r'href="/syarat-ketentuan"', r'href="syarat-ketentuan"'),
    (r'href="/404"', r'href="404"'),
    
    # Logo fallback onerror
    (r'src="assets/images/logo\.svg"\s+alt="Goodebag Logo"\s+class="site-logo"', 
     r'src="assets/images/logo.svg" onerror="this.onerror=null; this.src=\'assets/images/logo.webp\';" alt="Goodebag Logo" class="site-logo"'),
    (r'src="assets/images/logo\.svg"\s+alt="Goodebag Logo"\s+class="footer-logo mb-3"', 
     r'src="assets/images/logo.svg" onerror="this.onerror=null; this.src=\'assets/images/logo.webp\';" alt="Goodebag Logo" class="footer-logo mb-3"')
]

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)

    if content != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"No changes needed for {filename}")

print("All HTML files processed successfully.")
