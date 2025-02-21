

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DIST_FOLDER = 'dist';
const DEPLOY_BRANCH = 'gh-pages';
const REPO_URL = 'https://github.com/4citeB4U/webportfoliocreator.git';

// Utility functions
const execute = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    process.exit(1);
  }
};

const ensureDistFolder = () => {
  if (!fs.existsSync(DIST_FOLDER)) {
    console.error('❌ Dist folder not found. Please run "npm run build" first.');
    process.exit(1);
  }
};

// Main deployment script
console.log('🚀 Starting deployment process...');

// Ensure dist folder exists
ensureDistFolder();

// Create temporary deployment folder
const tempFolder = path.join(__dirname, 'temp_deploy');
if (fs.existsSync(tempFolder)) {
  fs.rmSync(tempFolder, { recursive: true });
}
fs.mkdirSync(tempFolder);

try {
  // Copy dist contents to temp folder
  console.log('📦 Preparing files for deployment...');
  fs.cpSync(DIST_FOLDER, tempFolder, { recursive: true });

  // Initialize git in temp folder
  process.chdir(tempFolder);
  execute('git init');
  execute('git add -A');
  execute(`git commit -m "Deploy to GitHub Pages - ${new Date().toISOString()}"`);

  // Push to GitHub Pages
  console.log('🚀 Deploying to GitHub Pages...');
  execute(`git push -f ${REPO_URL} main:${DEPLOY_BRANCH}`);

  console.log('✨ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
} finally {
  // Cleanup
  process.chdir(__dirname);
  if (fs.existsSync(tempFolder)) {
    fs.rmSync(tempFolder, { recursive: true });
  }
}

// Create or update CNAME file if needed
const cnameContent = 'webportfoliocreator.com'; // Replace with your domain
fs.writeFileSync(path.join(DIST_FOLDER, 'CNAME'), cnameContent);

console.log(`
✅ Deployment complete!
🌐 Your site should be available at:
   https://4citeB4U.github.io/webportfoliocreator/
`);
