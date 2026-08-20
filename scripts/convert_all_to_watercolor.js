import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { execSync } from 'child_process';

const WIDTH = 480;
const HEIGHT = 600;

// Draw high-quality vintage parchment paper base
function drawParchment(ctx, w, h) {
  // Radiant antique parchment gradient
  const bgGrad = ctx.createRadialGradient(w * 0.48, h * 0.42, 60, w * 0.5, h * 0.5, w * 0.85);
  bgGrad.addColorStop(0, '#faf5ec');
  bgGrad.addColorStop(0.45, '#f5ede0');
  bgGrad.addColorStop(0.8, '#ede2d0');
  bgGrad.addColorStop(1, '#e2d2bd');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Soft vintage grain & texture
  ctx.save();
  ctx.globalAlpha = 0.035;
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const rad = Math.random() * 1.8 + 0.4;
    ctx.fillStyle = Math.random() > 0.5 ? '#4a331e' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Subtle paper fibers
  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 160; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() * 16 - 8), y + (Math.random() * 16 - 8));
    ctx.stroke();
  }
  ctx.restore();
}

// Draw artistic tricolour watercolor washes (saffron wash upper-left, sage green wash right)
function drawWatercolorSplashes(ctx, w, h) {
  ctx.save();

  // 1. Saffron / Warm Ochre Brush Sweep on Left
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  
  // Primary soft sweeping saffron stroke
  const saffGrad = ctx.createLinearGradient(w * 0.02, h * 0.32, w * 0.48, h * 0.58);
  saffGrad.addColorStop(0, 'rgba(235, 140, 62, 0.48)');
  saffGrad.addColorStop(0.5, 'rgba(242, 168, 92, 0.28)');
  saffGrad.addColorStop(1, 'rgba(248, 205, 145, 0)');
  
  ctx.fillStyle = saffGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.20, h * 0.45, w * 0.28, h * 0.20, -Math.PI / 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Secondary soft saffron texture arcs
  ctx.fillStyle = 'rgba(220, 125, 50, 0.22)';
  ctx.beginPath();
  ctx.ellipse(w * 0.14, h * 0.40, w * 0.20, h * 0.13, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Delicate saffron paint droplets
  const saffDots = [
    [0.08, 0.36, 2.8], [0.06, 0.44, 2.0], [0.12, 0.52, 2.4],
    [0.04, 0.49, 1.4], [0.17, 0.32, 1.8], [0.22, 0.58, 2.6],
    [0.28, 0.62, 1.6], [0.05, 0.30, 1.2]
  ];
  for (const [rx, ry, r] of saffDots) {
    ctx.fillStyle = 'rgba(215, 118, 45, 0.38)';
    ctx.beginPath();
    ctx.arc(w * rx, h * ry, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 2. Forest / Sage Green Wash on Right
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  
  const greenGrad = ctx.createLinearGradient(w * 0.98, h * 0.40, w * 0.52, h * 0.64);
  greenGrad.addColorStop(0, 'rgba(48, 110, 68, 0.45)');
  greenGrad.addColorStop(0.55, 'rgba(75, 136, 95, 0.25)');
  greenGrad.addColorStop(1, 'rgba(115, 168, 132, 0)');

  ctx.fillStyle = greenGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.80, h * 0.51, w * 0.27, h * 0.19, Math.PI / 7, 0, Math.PI * 2);
  ctx.fill();

  // Secondary green texture arcs
  ctx.fillStyle = 'rgba(40, 92, 58, 0.20)';
  ctx.beginPath();
  ctx.ellipse(w * 0.86, h * 0.56, w * 0.18, h * 0.12, Math.PI / 5, 0, Math.PI * 2);
  ctx.fill();

  // Delicate green paint droplets
  const greenDots = [
    [0.90, 0.40, 2.6], [0.94, 0.47, 1.8], [0.86, 0.58, 2.2],
    [0.96, 0.54, 1.4], [0.81, 0.63, 2.0], [0.74, 0.46, 1.6],
    [0.70, 0.55, 1.3], [0.92, 0.34, 1.2]
  ];
  for (const [rx, ry, r] of greenDots) {
    ctx.fillStyle = 'rgba(42, 92, 58, 0.36)';
    ctx.beginPath();
    ctx.arc(w * rx, h * ry, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

// Convert source portrait into warm sepia watercolor & pencil sketch portrait
async function convertPortrait(sourcePath, targetWebp, thumbWebp) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // 1. Render background parchment
  drawParchment(ctx, WIDTH, HEIGHT);

  // 2. Render watercolor splashes
  drawWatercolorSplashes(ctx, WIDTH, HEIGHT);

  // 3. Process figure if source image exists
  if (fs.existsSync(sourcePath)) {
    const rawImg = await loadImage(sourcePath);

    const pCanvas = createCanvas(WIDTH, HEIGHT);
    const pCtx = pCanvas.getContext('2d');

    // Scale to fit nicely in 480x600 bust portrait
    const scale = Math.max(WIDTH / rawImg.width, (HEIGHT * 0.88) / rawImg.height);
    const sw = rawImg.width * scale;
    const sh = rawImg.height * scale;
    const sx = (WIDTH - sw) / 2;
    const sy = (HEIGHT * 0.06);

    pCtx.drawImage(rawImg, sx, sy, sw, sh);

    // Apply sepia pencil engraving & tonal mapping
    const imgData = pCtx.getImageData(0, 0, WIDTH, HEIGHT);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a === 0) continue;

      // Perceptual luminance
      let lum = (0.299 * r + 0.587 * g + 0.114 * b);

      // Contrast enhancement curve
      lum = lum / 255;
      lum = lum < 0.5 ? 2.1 * lum * lum : 1 - 2.1 * (1 - lum) * (1 - lum);
      lum = Math.min(1, Math.max(0, lum));

      // Color mapping: Charcoal-Sepia Shadow -> Warm Sienna Midtone -> Cream Highlight
      let targetR, targetG, targetB;

      if (lum < 0.40) {
        const t = lum / 0.40;
        targetR = 38 + t * (118 - 38);
        targetG = 26 + t * (90 - 26);
        targetB = 18 + t * (66 - 18);
      } else if (lum < 0.80) {
        const t = (lum - 0.40) / 0.40;
        targetR = 118 + t * (232 - 118);
        targetG = 90 + t * (216 - 90);
        targetB = 66 + t * (192 - 66);
      } else {
        const t = (lum - 0.80) / 0.20;
        targetR = 232 + t * (248 - 232);
        targetG = 216 + t * (242 - 216);
        targetB = 192 + t * (230 - 192);
      }

      data[i] = targetR;
      data[i + 1] = targetG;
      data[i + 2] = targetB;
    }

    pCtx.putImageData(imgData, 0, 0);

    // Watercolor vignette mask (preserves head/face, softens shoulders and dissipates bottom edge)
    const maskCanvas = createCanvas(WIDTH, HEIGHT);
    const mCtx = maskCanvas.getContext('2d');

    const radMask = mCtx.createRadialGradient(WIDTH * 0.5, HEIGHT * 0.38, 110, WIDTH * 0.5, HEIGHT * 0.44, 280);
    radMask.addColorStop(0, 'rgba(0,0,0,1)');
    radMask.addColorStop(0.65, 'rgba(0,0,0,0.94)');
    radMask.addColorStop(0.85, 'rgba(0,0,0,0.50)');
    radMask.addColorStop(1, 'rgba(0,0,0,0)');

    mCtx.fillStyle = radMask;
    mCtx.fillRect(0, 0, WIDTH, HEIGHT);

    // Feathered gradient toward bottom
    const botGrad = mCtx.createLinearGradient(0, HEIGHT * 0.68, 0, HEIGHT * 0.98);
    botGrad.addColorStop(0, 'rgba(0,0,0,1)');
    botGrad.addColorStop(1, 'rgba(0,0,0,0)');
    mCtx.globalCompositeOperation = 'destination-in';
    mCtx.fillStyle = botGrad;
    mCtx.fillRect(0, 0, WIDTH, HEIGHT);

    // Apply mask to portrait
    pCtx.globalCompositeOperation = 'destination-in';
    pCtx.drawImage(maskCanvas, 0, 0);

    // Composite portrait onto parchment background with multiply
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.97;
    ctx.drawImage(pCanvas, 0, 0);
    ctx.restore();

    // Fine watercolor edge spatters along figure boundary
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(75, 50, 32, 0.26)';
    const edgeSplats = [
      [0.20, 0.76, 2.2], [0.26, 0.81, 1.6], [0.33, 0.87, 2.5],
      [0.67, 0.87, 2.4], [0.74, 0.81, 1.7], [0.80, 0.75, 2.0],
      [0.16, 0.66, 1.5], [0.84, 0.65, 1.6], [0.48, 0.92, 2.0],
      [0.55, 0.91, 1.5], [0.40, 0.89, 1.4]
    ];
    for (const [rx, ry, r] of edgeSplats) {
      ctx.beginPath();
      ctx.arc(WIDTH * rx, HEIGHT * ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Write high quality WebP files
  const tempPng = path.join(process.cwd(), `temp_${path.basename(targetWebp, '.webp')}.png`);
  fs.writeFileSync(tempPng, canvas.toBuffer('image/png'));

  execSync(`ffmpeg -y -i "${tempPng}" -q:v 90 "${targetWebp}"`, { stdio: 'ignore' });
  execSync(`ffmpeg -y -i "${targetWebp}" -vf "scale=240:300" -q:v 85 "${thumbWebp}"`, { stdio: 'ignore' });

  if (fs.existsSync(tempPng)) fs.unlinkSync(tempPng);
}

async function convertAll() {
  const manifest = JSON.parse(fs.readFileSync('assets/portraits/manifest.json', 'utf8'));
  const entries = Object.entries(manifest.portraits);
  console.log(`Converting all ${entries.length} portraits into watercolor sketch format...`);

  let count = 0;
  for (const [name, relPath] of entries) {
    if (name === 'Expunged Proceedings') continue;

    const targetFile = path.join(process.cwd(), relPath);
    const thumbFile = path.join(process.cwd(), relPath.replace('assets/portraits/', 'assets/portraits/thumbs/'));
    
    // We convert using targetFile as source (or we create clean sketch portrait)
    await convertPortrait(targetFile, targetFile, thumbFile);
    count++;
    if (count % 15 === 0 || count === entries.length) {
      console.log(`Converted ${count}/${entries.length} portraits...`);
    }
  }

  console.log(`All ${count} portraits successfully converted to the website watercolor sketch format!`);
}

convertAll();
