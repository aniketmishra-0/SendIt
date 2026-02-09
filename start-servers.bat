@echo off
REM ============================================
REM SendIt - Start All Servers (Windows)
REM ============================================

echo.
echo  ====================================
echo   SendIt Server Launcher
echo  ====================================
echo.

REM Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Install Python 3.10+
    pause
    exit /b 1
)

echo [1/3] Installing Python dependencies...
cd /d "%~dp0server\python"
pip install -r requirements.txt -q

echo.
echo [2/3] Starting Python server (port 8765)...
start "SendIt Python Server" cmd /c "cd /d %~dp0server\python && python -m uvicorn main:app --host 0.0.0.0 --port 8765 --ws-ping-interval 20 --ws-ping-timeout 20"
timeout /t 2 >nul

echo [3/3] Starting Web server (port 5000)...
cd /d "%~dp0"
start "SendIt Web Server" cmd /c "npx http-server -p 5000 --cors"

echo.
echo  ====================================
echo   All servers started!
echo  ====================================
echo.
echo   Web App:        http://localhost:5000
echo   Python Server:  http://localhost:8765
echo   Python WS:      ws://localhost:8765/ws/{room}
echo.
echo   Press any key to stop all servers...
pause >nul

REM Kill servers
taskkill /FI "WINDOWTITLE eq SendIt Python Server" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq SendIt Web Server" /T /F >nul 2>nul
echo Servers stopped.
