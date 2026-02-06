@echo off
echo ========================================
echo Starting Smart Agriculture Application
echo ========================================
echo.
echo This will start both backend and frontend servers
echo Make sure MongoDB is running before starting!
echo.
pause

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: Will open automatically
echo.
echo Close the windows or press Ctrl+C in each to stop
pause
