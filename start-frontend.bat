@echo off
echo ========================================
echo Starting Smart Agriculture Frontend
echo ========================================
cd Frontend
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting frontend development server...
echo Frontend will open in your browser
echo Press Ctrl+C to stop the server
echo.
call npm run dev
pause
