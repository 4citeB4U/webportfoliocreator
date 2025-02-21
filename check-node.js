// Simple Node.js version checker
const requiredVersion = '18.0.0';

function checkNodeVersion() {
    const currentVersion = process.versions.node;
    const currentMajor = parseInt(currentVersion.split('.')[0]);
    const requiredMajor = parseInt(requiredVersion.split('.')[0]);

    console.log('🔍 Checking Node.js version...');
    console.log(`Current version: ${currentVersion}`);
    console.log(`Required version: ${requiredVersion}+\n`);

    if (currentMajor < requiredMajor) {
        console.error('❌ Error: Node.js version is too old');
        console.error(`Please install Node.js version ${requiredVersion} or higher`);
        console.error('Download from: https://nodejs.org/\n');
        process.exit(1);
    }

    console.log('✅ Node.js version check passed!\n');
}

try {
    checkNodeVersion();
} catch (error) {
    console.error('❌ Error checking Node.js version:', error.message);
    process.exit(1);
}
