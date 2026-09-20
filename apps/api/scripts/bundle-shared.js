const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../../packages/shared-types');
const targetDir = path.resolve(__dirname, '../node_modules/@tudongnro/shared-types');

console.log('[bundle-shared] Bundling shared-types into apps/api/node_modules/@tudongnro/shared-types...');

try {
  // If target exists, remove it whether it is a symlink or directory
  if (fs.existsSync(targetDir)) {
    try {
      const stat = fs.lstatSync(targetDir);
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(targetDir);
      } else {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
    } catch (e) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
  }

  // Ensure parent directory @tudongnro exists
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });

  // Create real target directory
  fs.mkdirSync(targetDir, { recursive: true });

  // Copy package.json
  const pkgSrc = path.join(srcDir, 'package.json');
  if (fs.existsSync(pkgSrc)) {
    fs.copyFileSync(pkgSrc, path.join(targetDir, 'package.json'));
  }

  // Copy dist recursively
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

  const distSrc = path.join(srcDir, 'dist');
  if (fs.existsSync(distSrc)) {
    copyRecursive(distSrc, path.join(targetDir, 'dist'));
    console.log('[bundle-shared] Successfully copied dist directory.');
  } else {
    console.warn('[bundle-shared] Warning: dist folder not found in shared-types!');
  }

  console.log('[bundle-shared] Done bundling shared-types.');
} catch (err) {
  console.error('[bundle-shared] Error bundling shared-types:', err);
  process.exit(1);
}
