#!/bin/bash
# AquaticMotiv - Stop Dev Server

PORT=3000

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Stopping AquaticMotiv server..."

# Kill by port
if lsof -ti:$PORT > /dev/null 2>&1; then
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ Server stopped (port $PORT)${NC}"
else
    echo -e "${YELLOW}No server running on port $PORT${NC}"
fi

# Kill any lingering next dev processes
pkill -f "next dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true

echo "Done."
