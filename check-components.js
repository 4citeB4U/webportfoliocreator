import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const components = [
    {
        name: 'Landing Page',
        path: 'src/landing-page/index.html',
        required: ['particles.js', 'qrcode']
    },
    {
        name: 'Agent Lee',
        path: 'src/agent-lee/index.html',
        required: ['particles.js']
    },
    {
        name: 'ProDriver Academy',
        path: 'src/prodriver/index.html',
        required: ['particles.js']
    },
    {
        name: 'Leola\'s Library',
        path: 'src/leola/index.html',
        required: ['particles.js']
    }
];

function checkComponent(component) {
    console.log(`\nChecking ${component.name}...`);
    
    const filePath = join(__dirname, component.path);
    if (!existsSync(filePath)) {
        console.error(`❌ ${component.path} not found`);
        return false;
    }

    try {
        const content = readFileSync(filePath, 'utf8');
        
        // Check for required dependencies
        const missingDeps = component.required.filter(dep => !content.includes(dep));
        if (missingDeps.length > 0) {
            console.error(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
            return false;
        }

        // Check for basic HTML structure
        const checks = [
            { name: 'DOCTYPE', pattern: '<!DOCTYPE html>' },
            { name: 'viewport meta', pattern: '<meta name="viewport"' },
            { name: 'charset', pattern: '<meta charset="UTF-8">' },
            { name: 'particles-js div', pattern: '<div id="particles-js"' }
        ];

        const failures = checks.filter(check => !content.includes(check.pattern));
        if (failures.length > 0) {
            console.error(`❌ Missing required elements: ${failures.map(f => f.name).join(', ')}`);
            return false;
        }

        // Check for consistent styling variables
        const styleChecks = [
            '--primary-neon',
            '--secondary-neon',
            '--accent-green',
            '--dark-bg'
        ];

        const missingStyles = styleChecks.filter(style => !content.includes(style));
        if (missingStyles.length > 0) {
            console.error(`❌ Missing style variables: ${missingStyles.join(', ')}`);
            return false;
        }

        console.log('✅ All checks passed');
        return true;
    } catch (error) {
        console.error(`❌ Error checking ${component.path}:`, error.message);
        return false;
    }
}

console.log('🔍 Checking components...');
const results = components.map(checkComponent);

const allPassed = results.every(result => result);
if (allPassed) {
    console.log('\n✨ All components are properly configured!');
    process.exit(0);
} else {
    console.error('\n❌ Some components need attention');
    process.exit(1);
}
