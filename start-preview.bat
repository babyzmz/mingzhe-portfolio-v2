@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Opening the self-contained preview instead.
  start "" "%~dp0Mingzhe-Portfolio-Preview.html"
  exit /b 0
)
echo Open http://127.0.0.1:8765 in your browser.
node scripts\serve.mjs
pause
