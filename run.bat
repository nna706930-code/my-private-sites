@echo off
title AniStream - Private Anime Streaming Vault
color 0b

echo ===================================================
echo     AniStream - Private Anime Streaming Vault
echo ===================================================
echo.

:: Navigate to project directory
cd /d "D:\Websites\anime-stream"

:: Ensure npm cache environment variable points to a valid local path
set NPM_CONFIG_CACHE=%LOCALAPPDATA%\npm-cache
set fund=false

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] First time run detected. Installing dependencies...
    call npm install
    echo.
)

echo [INFO] Starting local development server on http://localhost:3000 ...
echo [INFO] Default credentials:
echo        Username: animefan
echo        Password: privatestreaming
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo.

:: Open browser automatically after 3 seconds
start "" timeout /t 3 /nobreak >nul & start http://localhost:3000

:: Start the Next.js dev server
call npm run dev

pause
