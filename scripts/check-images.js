/**
 * scripts/check-images.js
 * Pengecekan konsistensi gambar:
 * Keluar dengan kode 1 (exit 1) jika ditemukan file JPG/JPEG/PNG tanpa pasangan WebP.
 * Keluar dengan kode 0 (exit 0) jika semua gambar sudah memiliki versi WebP.
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.resolve(__dirname, '../assets/images');
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const IGNORED_DIRS = new Set(['node_modules', '.git', 'scratch', '_backup-gambar', '_originals']);

function toKebabCase(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const clean = base
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-');
  return clean || 'image';
}

function scanImages(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanImages(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (VALID_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function checkAllImages() {
  console.log('🔍 [AUDIT GAMBAR] Memeriksa kelengkapan format WebP di:', IMAGES_DIR);
  const rawImages = scanImages(IMAGES_DIR);

  let unoptimized = [];

  for (const imgPath of rawImages) {
    const dir = path.dirname(imgPath);
    const filename = path.basename(imgPath);
    const cleanBase = toKebabCase(filename);
    const webpPath = path.join(dir, `${cleanBase}.webp`);

    if (!fs.existsSync(webpPath)) {
      unoptimized.push({
        file: path.relative(path.resolve(__dirname, '..'), imgPath),
        expectedWebp: path.relative(path.resolve(__dirname, '..'), webpPath)
      });
    }
  }

  if (unoptimized.length > 0) {
    console.error(`\n❌ [GAGAL AUDIT] Ditemukan ${unoptimized.length} gambar tanpa versi WebP:`);
    for (const item of unoptimized) {
      console.error(`   - ${item.file} (harus ada: ${item.expectedWebp})`);
    }
    console.error('\nSilakan jalankan "npm run images" untuk mengonversi gambar di atas.\n');
    process.exit(1);
  } else {
    console.log(`✅ [AUDIT LOLOS] Seluruh gambar di proyek telah memiliki versi WebP yang optimal.`);
    process.exit(0);
  }
}

checkAllImages();
