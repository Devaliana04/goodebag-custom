/**
 * scripts/optimize-images.js
 * Sistem otomatis konversi JPG/JPEG/PNG ke format WebP di proyek goodiebag.web.id
 *
 * Fitur:
 * - Quality 80 untuk foto, aspect ratio terjaga, lebar maksimal 1600px (tanpa perbesaran).
 * - Menjaga transparansi PNG.
 * - Penamaan otomatis huruf kecil dan tanda hubung (kebab-case).
 * - Mengarsipkan file asli ke folder `_originals/` secara aman (tidak menghapus permanen).
 * - Mendukung mode sekali jalan (npm run images) dan mode watch realtime (npm run images:watch).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.resolve(__dirname, '../assets/images');
const ORIGINALS_DIR = path.resolve(__dirname, '../_originals');

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const IGNORED_DIRS = new Set(['node_modules', '.git', 'scratch', '_backup-gambar', '_originals']);

// Normalisasi nama file ke lowercase kebab-case
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

// Rekursif mencari semua file gambar di suatu direktori
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

// Fungsi konversi file tunggal
async function processImage(filePath) {
  const dir = path.dirname(filePath);
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();

  const cleanBase = toKebabCase(filename);
  const webpFilename = `${cleanBase}.webp`;
  const webpPath = path.join(dir, webpFilename);

  // Jika file WebP sudah ada dan file asli adalah file existing yang sama namanya
  // Jangan menimpa atau memindahkan jika itu file existing yang sudah memiliki webp
  if (fs.existsSync(webpPath) && webpPath !== filePath) {
    // Cek apakah ini file existing di assets/images/materials/*.png
    // Jangan ubah file yang sudah ada
    return {
      status: 'skipped',
      file: filename,
      reason: `WebP sudah ada (${webpFilename})`
    };
  }

  try {
    const originalStats = fs.statSync(filePath);
    const originalSizeKb = (originalStats.size / 1024).toFixed(1);

    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = sharp(filePath);

    // Maksimal lebar 1600px menjaga rasio
    if (metadata.width && metadata.width > 1600) {
      pipeline = pipeline.resize({
        width: 1600,
        withoutEnlargement: true
      });
    }

    // Konversi WebP (quality 80, effort 6, transparansi PNG terjaga)
    pipeline = pipeline.webp({
      quality: 80,
      effort: 6
    });

    // Simpan WebP ke folder yang sama
    await pipeline.toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
    const webpSizeKb = (webpStats.size / 1024).toFixed(1);

    // Amankan file asli ke folder _originals
    const relFromImages = path.relative(IMAGES_DIR, filePath);
    const originalBackupPath = path.join(ORIGINALS_DIR, relFromImages);
    fs.mkdirSync(path.dirname(originalBackupPath), { recursive: true });
    fs.copyFileSync(filePath, originalBackupPath);

    // Hapus file mentah dari assets/images agar hanya versi webp yang dipakai
    fs.unlinkSync(filePath);

    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

    return {
      status: 'converted',
      original: filename,
      webp: webpFilename,
      originalSize: `${originalSizeKb} KB`,
      webpSize: `${webpSizeKb} KB`,
      dimensions: `${metadata.width}x${metadata.height}`,
      savings: `${savings}%`,
      backupLocation: path.relative(path.resolve(__dirname, '..'), originalBackupPath)
    };
  } catch (err) {
    return {
      status: 'error',
      file: filename,
      error: err.message
    };
  }
}

// Mode sekali jalan (batch)
async function runBatch() {
  console.log('🔍 Memindai folder gambar:', IMAGES_DIR);
  const images = scanImages(IMAGES_DIR);

  if (images.length === 0) {
    console.log('✅ Tidak ada gambar JPG/JPEG/PNG yang perlu diproses.');
    return;
  }

  console.log(`📸 Ditemukan ${images.length} file gambar JPG/PNG.`);
  let convertedCount = 0;
  let skippedCount = 0;

  for (const imgPath of images) {
    const res = await processImage(imgPath);
    if (res.status === 'converted') {
      convertedCount++;
      console.log(`✨ [KONVERSI BERHASIL] ${res.original} -> ${res.webp}`);
      console.log(`   Ukuran: ${res.originalSize} -> ${res.webpSize} (Hemat ${res.savings})`);
      console.log(`   File asli diamankan ke: ${res.backupLocation}`);
    } else if (res.status === 'skipped') {
      skippedCount++;
      // Diam atau log jika perlu
    } else if (res.status === 'error') {
      console.error(`❌ [GAGAL] ${res.file}: ${res.error}`);
    }
  }

  console.log(`\n🎉 Selesai: ${convertedCount} dikonversi, ${skippedCount} dilewati.`);
}

// Mode pemantauan realtime (watch)
function runWatch() {
  const chokidar = require('chokidar');
  console.log('👀 [WATCH MODE AKTIF] Memantau penambahan gambar di:', IMAGES_DIR);
  console.log('   Taruh file JPG/PNG baru di folder gambar, dan sistem akan langsung mengubahnya ke WebP...');

  const watcher = chokidar.watch(IMAGES_DIR, {
    ignored: [/(^|[\/\\])\../, ...Array.from(IGNORED_DIRS)],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100
    }
  });

  watcher.on('add', async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (VALID_EXTENSIONS.has(ext)) {
      console.log(`\n📥 Gambar baru terdeteksi: ${path.basename(filePath)}`);
      const res = await processImage(filePath);
      if (res.status === 'converted') {
        console.log(`✨ [KONVERSI OTOMATIS SUKSES] ${res.original} -> ${res.webp}`);
        console.log(`   Ukuran: ${res.originalSize} -> ${res.webpSize} (Hemat ${res.savings})`);
        console.log(`   File asli disimpan di: ${res.backupLocation}`);
      } else if (res.status === 'error') {
        console.error(`❌ [GAGAL KONVERSI]: ${res.error}`);
      }
    }
  });
}

// Main execution
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  runWatch();
} else {
  runBatch();
}
