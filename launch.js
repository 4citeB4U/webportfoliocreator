import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Launching Portfolio Creation Platform...\n');

// Run component checks
console.log('🔍 Running component checks...');
const checkProcess = spawn('node', ['check-components.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

checkProcess.on('close', (code) => {
    if (code !== 0) {
        console.error('\n❌ Component checks failed. Please fix the issues before launching.');
        process.exit(1);
    }

    console.log('\n✅ Component checks passed');
    
    // Start the server
    console.log('\n🌐 Starting server...');
    const serverProcess = spawn('node', ['server.js'], {
        stdio: 'inherit',
        cwd: __dirname,
        env: {
            ...process.env,
            NODE_ENV: 'development'
        }
    });

    serverProcess.on('error', (error) => {
        console.error('\n❌ Failed to start server:', error);
        process.exit(1);
    });

    // Handle process termination
    const cleanup = () => {
        console.log('\n👋 Shutting down...');
        serverProcess.kill();
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
});

// Print help message
console.log('\n📝 Available commands:');
console.log('  - npm start     : Start the server');
console.log('  - npm run check : Run component checks');
console.log('\n💡 Press Ctrl+C to stop the server\n');
