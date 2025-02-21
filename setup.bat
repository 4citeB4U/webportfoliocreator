@echo off
echo 🔧 Setting up Portfolio Creation Platform...

:: Check Node.js installation
echo.
echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo ✅ Node.js is installed

:: Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed

:: Run component checks
echo.
echo 🔍 Running component checks...
call node check-components.js
if errorlevel 1 (
    echo ❌ Component checks failed
    exit /b 1
)
echo ✅ Component checks passed

:: Setup complete
echo.
echo ✨ Setup complete! You can now run:
echo   npm start     - Start the server
echo   npm run check - Run component checks
echo.
echo 💡 Visit http://localhost:3000 after starting the server
