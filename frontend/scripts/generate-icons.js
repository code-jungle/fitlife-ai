import fs from 'fs';
import path from 'path';

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

function createIconSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient from orange-red to pink/magenta -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF007F;stop-opacity:1" />
    </linearGradient>
    
    <!-- Glow effect for text -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background with rounded corners (squircle) -->
  <rect x="32" y="32" width="448" height="448" rx="80" ry="80" fill="url(#bgGradient)"/>
  
  <!-- Text FitLife AI -->
  <g transform="translate(256, 256)" filter="url(#glow)">
    <text x="0" y="-15" text-anchor="middle" fill="#FFFFFF" font-family="Orbitron, Arial, sans-serif" font-size="56" font-weight="bold">
      FitLife
    </text>
    <text x="0" y="35" text-anchor="middle" fill="#FFFFFF" font-family="Orbitron, Arial, sans-serif" font-size="40" font-weight="700">
      AI
    </text>
  </g>
</svg>`;
}

// Generate all icon sizes
sizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const filename = `public/icon-${size}.svg`;
  fs.writeFileSync(filename, svgContent);
  console.log(`Generated icon-${size}.svg`);
});

console.log('All icons generated successfully!');
