@echo off
echo ========================================
echo Starting Smart Agriculture Backend
echo ========================================
cd backend
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting backend server...
echo Backend will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
call npm start
pause
