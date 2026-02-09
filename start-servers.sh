#!/bin/bash
# ============================================
# SendIt - Start All Servers (Linux/Mac)
# ============================================

echo ""
echo " ===================================="
echo "  SendIt Server Launcher"
echo " ===================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 not found! Install Python 3.10+"
    exit 1
fi

# Install Python dependencies
echo "[1/3] Installing Python dependencies..."
cd "$SCRIPT_DIR/server/python"
pip3 install -r requirements.txt -q

# Start Python server
echo ""
echo "[2/3] Starting Python server (port 8765)..."
cd "$SCRIPT_DIR/server/python"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8765 --ws-ping-interval 20 --ws-ping-timeout 20 &
PYTHON_PID=$!
sleep 2

# Start web server
echo "[3/3] Starting Web server (port 5000)..."
cd "$SCRIPT_DIR"
npx http-server -p 5000 --cors &
WEB_PID=$!

echo ""
echo " ===================================="
echo "  All servers started!"
echo " ===================================="
echo ""
echo "  Web App:        http://localhost:5000"
echo "  Python Server:  http://localhost:8765"
echo "  Python WS:      ws://localhost:8765/ws/{room}"
echo ""
echo "  Press Ctrl+C to stop all servers..."

# Cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $PYTHON_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    echo "Done."
}
trap cleanup EXIT

wait
