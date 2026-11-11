/**
 * scripts/install-hook.js
 * Memasang git pre-commit hook secara otomatis saat npm install
 */

const fs = require('fs');
const path = require('path');

const hookDir = path.resolve(__dirname, '../.git/hooks');
const hookPath = path.join(hookDir, 'pre-commit');

const hookScript = `#!/bin/sh
# Git pre-commit hook otomatis untuk optimasi gambar di goodiebag.web.id

echo "🚀 [pre-commit] Memeriksa & mengonversi gambar baru ke format WebP..."
node scripts/optimize-images.js

echo "🔍 [pre-commit] Memvalidasi status gambar..."
node scripts/check-images.js
if [ $? -ne 0 ]; then
  echo "❌ [pre-commit] Batal commit: Terdapat gambar tanpa format WebP."
  exit 1
fi

# Otomatis stage file WebP yang baru dibuat ke git commit
git add assets/images/
echo "✅ [pre-commit] Siap commit."
exit 0
`;

try {
  if (fs.existsSync(hookDir)) {
    fs.writeFileSync(hookPath, hookScript, { mode: 0o755 });
    console.log('✅ [GIT HOOK] pre-commit hook berhasil dipasang di .git/hooks/pre-commit');
  }
} catch (e) {
  console.warn('⚠️ Tidak dapat memasang git hook otomatis:', e.message);
}
