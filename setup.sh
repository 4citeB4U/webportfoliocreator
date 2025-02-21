#!/bin/bash

echo "🔧 Setting up Portfolio Creation Platform..."

# Make script exit on first error
set -e

# Check Node.js installation
echo -e "\n🔍 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js is installed"

# Make script executable
chmod +x launch.js
chmod +x check-components.js
chmod +x server.js

# Install dependencies
echo -e "\n📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Run component checks
echo -e "\n🔍 Running component checks..."
node check-components.js
echo "✅ Component checks passed"

# Setup complete
echo -e "\n✨ Setup complete! You can now run:"
echo "  npm start     - Start the server"
echo "  npm run check - Run component checks"
echo -e "\n💡 Visit http://localhost:3000 after starting the server"
