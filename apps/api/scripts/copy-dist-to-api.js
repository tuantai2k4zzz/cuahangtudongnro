const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const apiDistDir = path.resolve(__dirname, '../api/dist');

console.log('[copy-dist-to-api] Copying dist to api/dist...');

try {
  if (!fs.existsSync(distDir)) {
    console.error('[copy-dist-to-api] Source dist directory does not exist:', distDir);
    process.exit(1);
  }

  if (fs.existsSync(apiDistDir)) {
    fs.rmSync(apiDistDir, { recursive: true, force: true });
  }

  function copyRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyRecursive(distDir, apiDistDir);
  console.log('[copy-dist-to-api] Successfully copied dist to api/dist!');
} catch (err) {
  console.error('[copy-dist-to-api] Error copying dist to api/dist:', err);
  process.exit(1);
}
