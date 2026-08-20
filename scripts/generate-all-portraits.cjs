const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const manifestPath = path.join(__dirname, '../assets/portraits/manifest.json');
const portraitsDir = path.join(__dirname, '../assets/portraits');
const thumbsDir = path.join(__dirname, '../assets/portraits/thumbs');

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Helper to get initials
function getInitials(name) {
  const cleaned = name.replace(/^(Dr\.|Mr\.|Mrs\.|Sardar|Pandit|The Hon'?ble|Sri|Shri|Seth|Sir|Maulana|Rajkumari|Khan|Raja|Gyani)\s+/gi, '')
                      .replace(/^(Sir|Dr\.|Mr\.|Mrs\.)\s+/gi, '')
                      .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Color schemes matching the historical archival aesthetic
const PALETTES = [
  { bg: '#f7f2ea', frame: '#8a4b2d', accent: '#c2410c', text: '#2c1e18', sub: '#7c5e52', seal: '#9a3412', crest: '#d97706' }, // Saffron Warmth
  { bg: '#f5f4ee', frame: '#244837', accent: '#15803d', text: '#192b21', sub: '#4f6b5c', seal: '#166534', crest: '#10b981' }, // Forest Verdigris
  { bg: '#f8f4ed', frame: '#78350f', accent: '#b45309', text: '#291c10', sub: '#78614e', seal: '#92400e', crest: '#f59e0b' }, // Antique Gold
  { bg: '#f4f3f7', frame: '#2d3748', accent: '#475569', text: '#1e293b', sub: '#64748b', seal: '#334155', crest: '#0284c7' }, // Imperial Slate
  { bg: '#faf1ed', frame: '#7f1d1d', accent: '#991b1b', text: '#301414', sub: '#855454', seal: '#b91c1c', crest: '#dc2626' }, // Deep Terracotta
  { bg: '#f3f6f5', frame: '#134e4a', accent: '#0f766e', text: '#132a28', sub: '#517471', seal: '#115e59', crest: '#14b8a6' }  // Archival Teal
];

function generatePortraitSvg(name, width = 400, height = 533) {
  const initials = getInitials(name);
  // Pick deterministic palette based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const p = PALETTES[hash % PALETTES.length];

  // Escaping
  const cleanName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Format display name for 2 lines if long
  let nameL1 = cleanName;
  let nameL2 = '';
  if (cleanName.length > 22) {
    const parts = cleanName.split(' ');
    const mid = Math.ceil(parts.length / 2);
    nameL1 = parts.slice(0, mid).join(' ');
    nameL2 = parts.slice(mid).join(' ');
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 400 533">
  <defs>
    <radialGradient id="vignette-${hash}" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="${p.bg}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#dfd5c7" stop-opacity="1"/>
    </radialGradient>
    <filter id="shadow-${hash}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#3d2b1f" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="533" fill="${p.bg}"/>
  <rect width="400" height="533" fill="url(#vignette-${hash})"/>

  <!-- Ornate Archival Outer Border -->
  <rect x="14" y="14" width="372" height="505" fill="none" stroke="${p.frame}" stroke-width="1.5" opacity="0.85"/>
  <rect x="20" y="20" width="360" height="493" fill="none" stroke="${p.sub}" stroke-width="0.75" stroke-dasharray="3,3" opacity="0.6"/>

  <!-- Corner Flourishes -->
  <g stroke="${p.frame}" stroke-width="1.5" fill="none" opacity="0.8">
    <path d="M14,34 Q34,34 34,14"/>
    <path d="M386,34 Q366,34 366,14"/>
    <path d="M14,499 Q34,499 34,519"/>
    <path d="M386,499 Q366,499 366,519"/>
  </g>

  <!-- Header Archival Seal -->
  <g transform="translate(200, 52)" text-anchor="middle">
    <circle cx="0" cy="0" r="14" fill="none" stroke="${p.seal}" stroke-width="1.2" opacity="0.7"/>
    <circle cx="0" cy="0" r="3" fill="${p.seal}" opacity="0.8"/>
    <!-- 24 Spokes (simplified 12 rays) -->
    <path d="M-12,0 L12,0 M0,-12 L0,12 M-8,-8 L8,8 M-8,8 L8,-8" stroke="${p.seal}" stroke-width="0.8" opacity="0.6"/>
  </g>

  <text x="200" y="82" font-family="'Georgia', serif" font-size="11" letter-spacing="3" text-anchor="middle" fill="${p.sub}" text-transform="uppercase" font-weight="600">
    CONSTITUENT ASSEMBLY · 1946–1950
  </text>

  <!-- Central Portrait Medallion -->
  <g transform="translate(200, 215)" filter="url(#shadow-${hash})">
    <!-- Outer Cameo Ring -->
    <circle cx="0" cy="0" r="96" fill="#fdfbf7" stroke="${p.frame}" stroke-width="3"/>
    <circle cx="0" cy="0" r="88" fill="none" stroke="${p.accent}" stroke-width="1" stroke-dasharray="4,2" opacity="0.75"/>
    <circle cx="0" cy="0" r="82" fill="${p.bg}" stroke="${p.sub}" stroke-width="0.75" opacity="0.4"/>

    <!-- Subtle Background Spoke Pattern inside Cameo -->
    <g stroke="${p.sub}" stroke-width="0.5" opacity="0.15">
      <circle cx="0" cy="0" r="60" fill="none"/>
      <line x1="-80" y1="0" x2="80" y2="0"/>
      <line x1="0" y1="-80" x2="0" y2="80"/>
      <line x1="-56" y1="-56" x2="56" y2="56"/>
      <line x1="-56" y1="56" x2="56" y2="-56"/>
    </g>

    <!-- Heraldic Monogram Initials -->
    <text x="0" y="24" font-family="'Times New Roman', 'Georgia', serif" font-size="62" font-weight="bold" text-anchor="middle" fill="${p.frame}" letter-spacing="2">
      ${initials}
    </text>

    <!-- Lower Medallion Star/Knot -->
    <circle cx="0" cy="74" r="3" fill="${p.accent}"/>
    <line x1="-20" y1="74" x2="-8" y2="74" stroke="${p.accent}" stroke-width="0.8"/>
    <line x1="8" y1="74" x2="20" y2="74" stroke="${p.accent}" stroke-width="0.8"/>
  </g>

  <!-- Personality Title Block -->
  <g transform="translate(200, 362)" text-anchor="middle">
    <!-- Decorative Divider Line -->
    <path d="M-60,-16 L60,-16" stroke="${p.frame}" stroke-width="0.75" opacity="0.4"/>
    <circle cx="0" cy="-16" r="2.5" fill="${p.crest}"/>

    ${nameL2 ? `
      <text x="0" y="10" font-family="'Georgia', serif" font-size="19" font-weight="bold" fill="${p.text}">
        ${nameL1}
      </text>
      <text x="0" y="32" font-family="'Georgia', serif" font-size="19" font-weight="bold" fill="${p.text}">
        ${nameL2}
      </text>
    ` : `
      <text x="0" y="18" font-family="'Georgia', serif" font-size="20" font-weight="bold" fill="${p.text}">
        ${nameL1}
      </text>
    `}

    <text x="0" y="${nameL2 ? 56 : 46}" font-family="'Segoe UI', 'Helvetica Neue', sans-serif" font-size="11.5" font-weight="600" letter-spacing="1.5" fill="${p.accent}" text-transform="uppercase">
      FOUNDING FRAMER · ARCHIVAL PROFILE
    </text>

    <!-- Bottom Emblem & Script Reference -->
    <g transform="translate(0, ${nameL2 ? 92 : 82})">
      <rect x="-85" y="-12" width="170" height="24" rx="12" fill="${p.bg}" stroke="${p.frame}" stroke-width="0.8" opacity="0.7"/>
      <text x="0" y="4" font-family="'Georgia', serif" font-size="10" fill="${p.sub}" letter-spacing="1" font-style="italic">
        Official Debates Registry
      </text>
    </g>
  </g>
</svg>`;
}

let generatedCount = 0;
const entries = Object.entries(manifest.portraits);

for (const [name, relPath] of entries) {
  const fullPath = path.join(__dirname, '..', relPath);
  const thumbPath = path.join(__dirname, '..', relPath.replace('/portraits/', '/portraits/thumbs/'));
  
  // If portrait doesn't exist, create both portrait and thumb
  if (!fs.existsSync(fullPath)) {
    const svg = generatePortraitSvg(name, 400, 533);
    const tempSvg = path.join(__dirname, `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.svg`);
    fs.writeFileSync(tempSvg, svg);
    
    // Convert to webp
    execSync(`ffmpeg -y -i "${tempSvg}" "${fullPath}" 2>/dev/null`);
    execSync(`ffmpeg -y -i "${tempSvg}" -vf scale=200:266 "${thumbPath}" 2>/dev/null`);
    fs.unlinkSync(tempSvg);
    generatedCount++;
    console.log(`Generated portrait for: ${name}`);
  } else if (!fs.existsSync(thumbPath)) {
    // If portrait exists but thumb doesn't, create thumb from existing portrait
    execSync(`ffmpeg -y -i "${fullPath}" -vf scale=200:266 "${thumbPath}" 2>/dev/null`);
    console.log(`Generated thumbnail for: ${name}`);
  }
}

console.log(`\nCompleted! Generated ${generatedCount} new personality portraits.`);
