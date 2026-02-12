#!/bin/bash
# AquaticMotiv - Start Dev Server

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PORT=3000

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "  AquaticMotiv - Dev Server"
echo "================================"
echo ""

# Check if port is already in use and kill existing process
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo -e "${YELLOW}Port $PORT is in use. Stopping existing server...${NC}"
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✓ Previous server stopped${NC}"
fi

# Kill any lingering next processes
pkill -f "next dev" 2>/dev/null || true

# Check node_modules exist
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "${YELLOW}Dependencies not installed. Running npm install...${NC}"
    cd "$SCRIPT_DIR" && npm install
    echo ""
fi

echo -e "${GREEN}Starting server on http://localhost:$PORT${NC}"
echo "Press Ctrl+C to stop."
echo ""

cd "$SCRIPT_DIR" && npm run dev
