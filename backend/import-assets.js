import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../assets/New folder');
const destDir = path.join(__dirname, '../frontend/public/assets/products');

async function copyAssets() {
  try {
    // Ensure destination directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    console.log(`Scanning source folder: ${sourceDir}`);
    const files = fs.readdirSync(sourceDir);
    let copiedCount = 0;

    for (const file of files) {
      const srcFile = path.join(sourceDir, file);
      const ext = path.extname(file).toLowerCase();
      
      // Copy images and PDFs
      if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.pdf', '.tif'].includes(ext)) {
        // Clean target filename (lowercase, remove spaces for clean URLs)
        const cleanName = file.toLowerCase().replace(/\s+/g, '_');
        const destFile = path.join(destDir, cleanName);

        fs.copyFileSync(srcFile, destFile);
        copiedCount++;
      }
    }

    console.log(`🎉 Successfully copied ${copiedCount} assets to frontend/public/assets/products/ directory.`);
  } catch (err) {
    console.error(`❌ Error copying assets:`, err.message);
  }
}

copyAssets();
