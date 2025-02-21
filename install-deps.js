import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const dependencies = [
  '@types/node',
  '@types/react',
  '@types/react-dom',
  'typescript',
  'vite',
  '@vitejs/plugin-react'
];

const devDependencies = [
  '@types/node@latest',
  '@types/react@latest',
  '@types/react-dom@latest',
  '@types/vite@latest',
  '@typescript-eslint/eslint-plugin@latest',
  '@typescript-eslint/parser@latest',
  'eslint-plugin-react@latest',
  'eslint-plugin-react-hooks@latest'
];

console.log('🔍 Checking dependencies...');

// Check if node_modules exists
if (!existsSync(join(process.cwd(), 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  try {
    // Install production dependencies
    execSync('npm install ' + dependencies.join(' '), { stdio: 'inherit' });
    
    // Install dev dependencies
    execSync('npm install -D ' + devDependencies.join(' '), { stdio: 'inherit' });
    
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Verify TypeScript setup
try {
  console.log('🔍 Verifying TypeScript setup...');
  execSync('npx tsc --version', { stdio: 'inherit' });
  console.log('✅ TypeScript is properly configured');
} catch (error) {
  console.error('❌ TypeScript verification failed:', error.message);
  process.exit(1);
}

// Run type check
try {
  console.log('🔍 Running type check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Type check passed');
} catch (error) {
  console.error('❌ Type check failed:', error.message);
  process.exit(1);
}

console.log('🚀 Setup complete! You can now run:');
console.log('npm start     - Start the development server');
console.log('npm run build - Build for production');
