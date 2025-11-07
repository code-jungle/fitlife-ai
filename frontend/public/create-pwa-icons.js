// Simple script to create PWA icon placeholders
const fs = require('fs');

// Create a simple 1x1 transparent PNG as placeholder
const transparentPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

console.log('Creating placeholder PWA icons...');
fs.writeFileSync('icon-192.png', transparentPNG);
fs.writeFileSync('icon-512.png', transparentPNG);
console.log('Placeholder icons created successfully');
