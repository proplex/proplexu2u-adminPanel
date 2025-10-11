const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Input and output paths
const inputPath = path.join(__dirname, 'public', 'proplex.png');
const publicDir = path.join(__dirname, 'public');

// Function to generate favicon sizes
async function generateFavicons() {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      return;
    }

    console.log('Generating favicons from:', inputPath);

    // Generate different sizes
    const sizes = [
      { width: 16, height: 16, name: 'favicon-16x16.png' },
      { width: 32, height: 32, name: 'favicon-32x32.png' },
      { width: 180, height: 180, name: 'apple-touch-icon.png' },
      { width: 192, height: 192, name: 'android-chrome-192x192.png' },
      { width: 512, height: 512, name: 'android-chrome-512x512.png' }
    ];

    // Generate each size
    for (const size of sizes) {
      const outputPath = path.join(publicDir, size.name);
      await sharp(inputPath)
        .resize(size.width, size.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`Generated ${size.name} (${size.width}x${size.height})`);
    }

    // Generate favicon.ico
    const icoPath = path.join(publicDir, 'favicon.ico');
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toBuffer()
      .then(data => {
        // For simplicity, we'll just save as PNG with .ico extension
        // In a real scenario, you might want to use a proper ICO generator
        fs.writeFileSync(icoPath, data);
        console.log('Generated favicon.ico (as PNG with .ico extension)');
      });

    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

// Run the function
generateFavicons();