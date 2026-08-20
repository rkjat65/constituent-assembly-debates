import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { execSync } from 'child_process';

const WIDTH = 480;
const HEIGHT = 600;

// Create background parchment texture canvas
function drawParchment(ctx, w, h) {
  // Base warm parchment
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 80, w * 0.5, h * 0.5, w * 0.75);
  bgGrad.addColorStop(0, '#f9f4eb');
  bgGrad.addColorStop(0.5, '#f4ece0');
  bgGrad.addColorStop(0.85, '#ede1d0');
  bgGrad.addColorStop(1, '#e3d2bc');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle paper grain & mottling
  ctx.save();
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const rad = Math.random() * 2 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? '#5c4028' : '#fff';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Subtle paper fibers
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = '#6e5134';
  ctx.lineWidth = 0.75;
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() * 14 - 7), y + (Math.random() * 14 - 7));
    ctx.stroke();
  }
  ctx.restore();
}

// Draw artistic tricolour watercolor washes behind the figure
function drawWatercolorSplashes(ctx, w, h) {
  ctx.save();

  // 1. Saffron / Warm Ochre Wash on the Left
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  
  // Broad sweeping saffron stroke
  const saffGrad = ctx.createLinearGradient(w * 0.05, h * 0.35, w * 0.45, h * 0.55);
  saffGrad.addColorStop(0, 'rgba(230, 138, 62, 0.45)');
  saffGrad.addColorStop(0.6, 'rgba(240, 165, 90, 0.25)');
  saffGrad.addColorStop(1, 'rgba(245, 200, 140, 0)');
  
  ctx.fillStyle = saffGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.22, h * 0.46, w * 0.26, h * 0.18, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Secondary soft saffron texture arcs
  ctx.fillStyle = 'rgba(215, 120, 48, 0.18)';
  ctx.beginPath();
  ctx.ellipse(w * 0.16, h * 0.42, w * 0.18, h * 0.12, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Saffron paint splatters
  const saffDots = [
    [0.10, 0.38, 2.5], [0.08, 0.44, 1.8], [0.13, 0.50, 2.0],
    [0.06, 0.48, 1.2], [0.18, 0.35, 1.5], [0.24, 0.56, 2.2]
  ];
  for (const [rx, ry, r] of saffDots) {
    ctx.fillStyle = 'rgba(210, 115, 45, 0.35)';
    ctx.beginPath();
    ctx.arc(w * rx, h * ry, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 2. Forest / Sage Green Wash on the Right
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  
  const greenGrad = ctx.createLinearGradient(w * 0.95, h * 0.42, w * 0.55, h * 0.62);
  greenGrad.addColorStop(0, 'rgba(52, 112, 70, 0.42)');
  greenGrad.addColorStop(0.6, 'rgba(80, 138, 98, 0.22)');
  greenGrad.addColorStop(1, 'rgba(120, 170, 135, 0)');

  ctx.fillStyle = greenGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.78, h * 0.50, w * 0.25, h * 0.17, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  // Secondary green texture arcs
  ctx.fillStyle = 'rgba(45, 95, 60, 0.18)';
  ctx.beginPath();
  ctx.ellipse(w * 0.84, h * 0.54, w * 0.16, h * 0.11, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Green paint splatters
  const greenDots = [
    [0.88, 0.42, 2.2], [0.92, 0.48, 1.6], [0.85, 0.56, 2.0],
    [0.94, 0.53, 1.2], [0.79, 0.60, 1.8], [0.73, 0.45, 1.4]
  ];
  for (const [rx, ry, r] of greenDots) {
    ctx.fillStyle = 'rgba(45, 95, 60, 0.32)';
    ctx.beginPath();
    ctx.arc(w * rx, h * ry, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

// Convert source image to detailed sepia pencil lithograph watercolor portrait
async function processPortrait(sourceImagePath, targetWebpPath, thumbWebpPath) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // 1. Base Parchment
  drawParchment(ctx, WIDTH, HEIGHT);

  // 2. Watercolor washes
  drawWatercolorSplashes(ctx, WIDTH, HEIGHT);

  // 3. Process the source portrait
  if (fs.existsSync(sourceImagePath)) {
    const rawImg = await loadImage(sourceImagePath);

    // Create intermediate canvas to render and filter the face
    const pCanvas = createCanvas(WIDTH, HEIGHT);
    const pCtx = pCanvas.getContext('2d');

    // Draw source scaled & cropped to top center (bust portrait)
    const scale = Math.max(WIDTH / rawImg.width, (HEIGHT * 0.82) / rawImg.height);
    const sw = rawImg.width * scale;
    const sh = rawImg.height * scale;
    const sx = (WIDTH - sw) / 2;
    const sy = (HEIGHT * 0.08); // slightly below top

    pCtx.drawImage(rawImg, sx, sy, sw, sh);

    // Get pixel data to apply sepia etching & tonal adjustment
    const imgData = pCtx.getImageData(0, 0, WIDTH, HEIGHT);
    const data = imgData.data;

    // Etching & watercolor tone mapping
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a === 0) continue;

      // Luminance
      let lum = (0.299 * r + 0.587 * g + 0.114 * b);

      // Contrast S-curve for crisp pencil / ink definition
      lum = lum / 255;
      lum = lum < 0.5 ? 2 * lum * lum : 1 - 2 * (1 - lum) * (1 - lum);
      lum = Math.min(1, Math.max(0, lum));

      // Map luminance to Sepia Sketch palette:
      // Dark shadows: #2c1e15 (deep sepia pencil)
      // Midtones: #7e6047 (warm sepia wash)
      // Highlights: #f8f1e5 (parchment tint)
      let targetR, targetG, targetB;

      if (lum < 0.45) {
        const t = lum / 0.45;
        targetR = 44 + t * (126 - 44);
        targetG = 30 + t * (96 - 30);
        targetB = 21 + t * (71 - 21);
      } else if (lum < 0.82) {
        const t = (lum - 0.45) / 0.37;
        targetR = 126 + t * (235 - 126);
        targetG = 96 + t * (218 - 96);
        targetB = 71 + t * (195 - 71);
      } else {
        const t = (lum - 0.82) / 0.18;
        targetR = 235 + t * (248 - 235);
        targetG = 218 + t * (241 - 218);
        targetB = 195 + t * (229 - 195);
      }

      data[i] = targetR;
      data[i + 1] = targetG;
      data[i + 2] = targetB;
    }

    pCtx.putImageData(imgData, 0, 0);

    // Apply watercolor vignette mask to the portrait
    const maskCanvas = createCanvas(WIDTH, HEIGHT);
    const mCtx = maskCanvas.getContext('2d');

    // Gradient mask that keeps head/face solid and fades shoulders/bottom naturally
    const radMask = mCtx.createRadialGradient(WIDTH * 0.5, HEIGHT * 0.38, 120, WIDTH * 0.5, HEIGHT * 0.45, 270);
    radMask.addColorStop(0, 'rgba(0,0,0,1)');
    radMask.addColorStop(0.65, 'rgba(0,0,0,0.92)');
    radMask.addColorStop(0.85, 'rgba(0,0,0,0.45)');
    radMask.addColorStop(1, 'rgba(0,0,0,0)');

    mCtx.fillStyle = radMask;
    mCtx.fillRect(0, 0, WIDTH, HEIGHT);

    // Bottom vertical fade
    const botGrad = mCtx.createLinearGradient(0, HEIGHT * 0.65, 0, HEIGHT * 0.98);
    botGrad.addColorStop(0, 'rgba(0,0,0,1)');
    botGrad.addColorStop(1, 'rgba(0,0,0,0)');
    mCtx.globalCompositeOperation = 'destination-in';
    mCtx.fillStyle = botGrad;
    mCtx.fillRect(0, 0, WIDTH, HEIGHT);

    // Apply mask to portrait canvas
    pCtx.globalCompositeOperation = 'destination-in';
    pCtx.drawImage(maskCanvas, 0, 0);

    // 4. Composite portrait onto parchment with multiply / watercolor blend
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.96;
    ctx.drawImage(pCanvas, 0, 0);
    ctx.restore();

    // 5. Add delicate watercolor edge splatters around bottom and shoulders
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(80, 55, 38, 0.22)';
    const edgeSplats = [
      [0.22, 0.78, 2.0], [0.28, 0.82, 1.5], [0.35, 0.86, 2.4],
      [0.65, 0.86, 2.2], [0.72, 0.82, 1.6], [0.78, 0.77, 1.8],
      [0.18, 0.68, 1.4], [0.82, 0.67, 1.5], [0.45, 0.90, 1.8]
    ];
    for (const [rx, ry, r] of edgeSplats) {
      ctx.beginPath();
      ctx.arc(WIDTH * rx, HEIGHT * ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 6. Save as high quality PNG buffer and convert to WebP
  const pngBuffer = canvas.toBuffer('image/png');
  const tempPng = path.join(process.cwd(), 'temp_render.png');
  fs.writeFileSync(tempPng, pngBuffer);

  // Convert to WebP 480x600 and 240x300
  execSync(`ffmpeg -y -i "${tempPng}" -q:v 88 "${targetWebpPath}"`, { stdio: 'ignore' });
  execSync(`ffmpeg -y -i "${targetWebpPath}" -vf "scale=240:300" -q:v 82 "${thumbWebpPath}"`, { stdio: 'ignore' });

  if (fs.existsSync(tempPng)) fs.unlinkSync(tempPng);
}

// Test rendering for a sample portrait
async function test() {
  console.log('Testing watercolor portrait generator...');
  const target = path.join(process.cwd(), 'assets/portraits/test-patel.webp');
  const thumb = path.join(process.cwd(), 'assets/portraits/thumbs/test-patel.webp');
  await processPortrait('assets/portraits/vallabhbhai-patel.webp', target, thumb);
  console.log('Test rendered successfully!');
}

test();
