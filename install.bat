@echo off
REM AquaticMotiv - Windows Installer

echo ==============================================
echo   AquaticMotiv - Installer
echo ==============================================
echo.

REM Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please download and install Node.js 18+ from https://nodejs.org
    echo Click the green LTS button, run the installer, then re-run this script.
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js found

REM Check for npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please reinstall Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] npm found

REM Install dependencies
echo.
echo Installing dependencies (this may take a minute)...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo [OK] Dependencies installed

REM Set up .env.local
if not exist .env.local (
    copy .env.local.example .env.local >nul
    echo [INFO] Created .env.local from template.
    echo        Edit .env.local to add your Shopify token for live data.
) else (
    echo [OK] .env.local already exists
)

REM Create start script
echo @echo off > start.bat
echo echo Starting AquaticMotiv... >> start.bat
echo npm run dev >> start.bat
echo [OK] start.bat created

REM Create stop script
echo @echo off > stop.bat
echo echo Stopping AquaticMotiv... >> stop.bat
echo for /f "tokens=5" %%%%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%%%a 2^>nul >> stop.bat
echo echo Done. >> stop.bat
echo [OK] stop.bat created

echo.
echo ==============================================
echo   Installation Complete!
echo ==============================================
echo.
echo To start the site:   start.bat
echo To stop the site:    stop.bat
echo Then open http://localhost:3000
echo.
pause
