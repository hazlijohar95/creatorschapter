#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, '../public/favicon-c.svg');
const iconDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    console.log('🎨 Generating PWA icons...');
    
    // Ensure icons directory exists
    await fs.ensureDir(iconDir);
    
    // Check if source icon exists
    if (!await fs.pathExists(sourceIcon)) {
      throw new Error(`Source icon not found: ${sourceIcon}`);
    }
    
    // Generate icons for each size
    for (const size of iconSizes) {
      const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({
          quality: 90,
          compressionLevel: 9
        })
        .toFile(outputPath);
        
      console.log(`✅ Generated ${size}x${size} icon`);
    }
    
    // Generate additional icons
    await generateAdditionalIcons();
    
    console.log('🎉 PWA icons generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

async function generateAdditionalIcons() {
  // Generate apple splash screens
  const splashSizes = [
    { width: 1242, height: 2688, name: 'apple-splash-1242-2688' },
    { width: 1125, height: 2436, name: 'apple-splash-1125-2436' },
    { width: 828, height: 1792, name: 'apple-splash-828-1792' },
    { width: 1242, height: 2208, name: 'apple-splash-1242-2208' },
    { width: 750, height: 1334, name: 'apple-splash-750-1334' },
    { width: 640, height: 1136, name: 'apple-splash-640-1136' }
  ];
  
  // Generate badge icon (for notifications)
  await sharp(sourceIcon)
    .resize(72, 72)
    .png()
    .toFile(path.join(iconDir, 'badge-72x72.png'));
    
  console.log('✅ Generated badge icon');
  
  // Generate dashboard shortcut icon
  await sharp(sourceIcon)
    .resize(96, 96)
    .png()
    .toFile(path.join(iconDir, 'dashboard-icon.png'));
    
  console.log('✅ Generated dashboard shortcut icon');
  
  // Generate search shortcut icon
  const searchSvg = `
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" rx="16" fill="#3b82f6"/>
      <path d="M42 32a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10zm0 24a14 14 0 0 0 14-14 14 14 0 0 0-14-14 14 14 0 0 0-14 14 14 14 0 0 0 14 14zm20 20-6-6 2.8-2.8 6 6L58 76z" fill="white"/>
    </svg>
  `;
  
  await sharp(Buffer.from(searchSvg))
    .png()
    .toFile(path.join(iconDir, 'search-icon.png'));
    
  console.log('✅ Generated search shortcut icon');
  
  // Generate message shortcut icon
  const messageSvg = `
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" rx="16" fill="#3b82f6"/>
      <path d="M20 30a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v36a4 4 0 0 1-4 4H34l-10 8v-8h0a4 4 0 0 1-4-4V30z" fill="white"/>
    </svg>
  `;
  
  await sharp(Buffer.from(messageSvg))
    .png()
    .toFile(path.join(iconDir, 'message-icon.png'));
    
  console.log('✅ Generated message shortcut icon');
}

// Run if called directly
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };