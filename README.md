# Goodiebag Web ID — Sistem Optimasi & Manajemen Gambar Otomatis

Proyek website resmi **https://goodiebag.web.id** dilengkapi dengan sistem pipeline gambar otomatis berbasis **Node.js & Sharp**. Setiap gambar baru (JPG, JPEG, atau PNG) yang ditambahkan akan otomatis diubah menjadi format **WebP** berkinerja tinggi, menjaga transparansi PNG, dan mengamankan file asli ke folder `_originals/`.

---

## Cara Menambah Gambar Artikel Baru (5 Langkah)

1. **Siapkan Foto:** Ambil foto atau desain artikel Anda (format `.jpg`, `.jpeg`, atau `.png`).
2. **Beri Nama File Deskriptif:** Gunakan huruf kecil dan tanda hubung, contoh: `tas-seminar-kanvas-malang.jpg` (jika tidak sengaja ada spasi atau huruf kapital, sistem akan otomatis merapikannya).
3. **Masukkan ke Folder Gambar:** Letakkan file tersebut ke dalam folder `assets/images/blog/` (atau folder `assets/images/` yang sesuai).
4. **Jalankan Optimasi Otomatis:**
   - **Opsi A (Sekali Jalan):** Jalankan perintah `npm run images` di terminal.
   - **Opsi B (Otomatis Saat Watch Aktif):** Jika `npm run images:watch` sedang berjalan di latar belakang, konversi terjadi seketika begitu file dimasukkan.
   - **Opsi C (Otomatis Saat Commit):** Sistem Git Pre-Commit Hook akan otomatis mengonversi gambar baru saat Anda melakukan `git commit`.
5. **Gunakan di HTML Artikel:** Panggil file `.webp` yang telah terbentuk di halaman HTML Anda menggunakan template snippet di bawah ini.

> **Catatan Keamanan:** File asli beresolusi tinggi Anda tidak akan hilang — sistem otomatis memindahkannya ke folder cadangan `_originals/` (tersembunyi dari publik dan diabaikan oleh Git).

---

## Template Snippet HTML Gambar Baru

Gunakan markup standar Google PageSpeed & Core Web Vitals berikut saat menyisipkan gambar pada artikel atau halaman produk:

```html
<!-- Template Standar Gambar Artikel (Responsif, Lazy Load & SEO Friendly) -->
<figure class="article-image-wrap mb-4">
  <img
    src="../assets/images/blog/nama-gambar-artikel.webp"
    alt="Deskripsi visual gambar yang relevan dan kaya kata kunci kontekstual"
    width="1200"
    height="800"
    loading="lazy"
    decoding="async"
    class="img-fluid rounded-3 shadow-sm"
  >
  <figcaption class="text-muted small mt-2 text-center">
    Keterangan foto atau visualisasi goodie bag custom untuk seminar dan kegiatan
  </figcaption>
</figure>
```

> **Aturan Penting:**
> - Gunakan `loading="lazy"` untuk seluruh gambar di bagian isi artikel (bawah layar/below-the-fold).
> - Selalu sertakan atribut `width` dan `height` asli untuk mencegah pergeseran tata letak halaman (Cumulative Layout Shift / CLS 0).
> - Jangan gunakan `loading="lazy"` khusus untuk gambar pertama paling atas (Hero LCP).

---

## Perintah NPM yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run images` | Memindai seluruh folder gambar dan mengonversi semua JPG/PNG baru ke WebP (Quality 80, maks lebar 1600px). |
| `npm run images:watch` | Mode pemantau realtime. Otomatis mengonversi setiap gambar yang baru dimasukkan ke `assets/images/`. |
| `npm run images:check` | Memvalidasi bahwa seluruh gambar JPG/PNG di proyek telah memiliki versi WebP (exit 1 jika ada yang belum). |

