import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

console.log('Starting production build...');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Helper to recursively copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy top level static files
const rootFiles = fs.readdirSync(rootDir);
for (const file of rootFiles) {
  const fullPath = path.join(rootDir, file);
  const stat = fs.statSync(fullPath);

  if (stat.isFile()) {
    if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.png') || file.endsWith('.webp') || file.endsWith('.svg') || file.endsWith('.ico')) {
      fs.copyFileSync(fullPath, path.join(distDir, file));
    }
  }
}

// Copy directories
const dirsToCopy = ['assets', 'data', 'speakers', 'sessions', 'topics'];
for (const d of dirsToCopy) {
  const src = path.join(rootDir, d);
  const dest = path.join(distDir, d);
  if (fs.existsSync(src)) {
    copyDir(src, dest);
  }
}

// Verify portraits in dist
const manifestPath = path.join(distDir, 'assets/portraits/manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let missing = 0;
  for (const [name, rel] of Object.entries(manifest.portraits)) {
    if (name === 'Expunged Proceedings') continue;
    const p = path.join(distDir, rel);
    const thumb = path.join(distDir, rel.replace('/portraits/', '/portraits/thumbs/'));
    if (!fs.existsSync(p) || !fs.existsSync(thumb)) {
      missing++;
    }
  }
  console.log(`Verified ${Object.keys(manifest.portraits).length} portraits in dist/ (missing: ${missing})`);
}

console.log('Build completed successfully! Assets and HTML mirrored to dist/.');
