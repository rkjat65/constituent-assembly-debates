import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Security & Cross-Origin Headers for preview iframes & live URLs
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const staticOptions = {
  extensions: ['html', 'htm'],
  dotfiles: 'ignore',
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
};

// Clean URL rewrite for top-level pages like /speakers, /chronology, /themes, etc.
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const directHtml = path.join(__dirname, `${page}.html`);
  if (fs.existsSync(directHtml) && fs.statSync(directHtml).isFile()) {
    return res.sendFile(directHtml);
  }
  next();
});

// Serve static assets from root and subdirectories
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticOptions));
app.use('/data', express.static(path.join(__dirname, 'data'), staticOptions));
app.use('/speakers', express.static(path.join(__dirname, 'speakers'), staticOptions));
app.use('/sessions', express.static(path.join(__dirname, 'sessions'), staticOptions));
app.use('/topics', express.static(path.join(__dirname, 'topics'), staticOptions));
app.use(express.static(__dirname, staticOptions));

// Fallback for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback route for extensionless HTML files
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const rawPath = req.path.replace(/^\//, '');
  const candidateHtml = path.join(__dirname, `${rawPath}.html`);
  if (fs.existsSync(candidateHtml) && fs.statSync(candidateHtml).isFile()) {
    return res.sendFile(candidateHtml);
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

