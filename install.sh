#!/bin/bash
#
# AquaticMotiv - One-Click Installer
# For macOS and Linux
#

set -e

echo "=============================================="
echo "  AquaticMotiv - Installer"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check for Node.js 18+
check_node() {
    echo "Checking Node.js installation..."

    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | sed 's/v//')
        MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

        if [ "$MAJOR" -ge 18 ]; then
            echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"
            return 0
        fi
    fi

    echo -e "${RED}✗ Node.js 18+ required${NC}"
    echo ""
    echo "Please install Node.js 18 or higher:"
    echo "  Download from: https://nodejs.org (click the LTS button)"
    echo ""
    echo "  Or via package manager:"
    echo "    macOS:  brew install node"
    echo "    Ubuntu: sudo apt install nodejs npm"
    exit 1
}

# Check for npm
check_npm() {
    echo "Checking npm installation..."

    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        echo -e "${GREEN}✓ npm $NPM_VERSION found${NC}"
        return 0
    fi

    echo -e "${RED}✗ npm not found${NC}"
    echo "npm should come with Node.js. Please reinstall Node.js from https://nodejs.org"
    exit 1
}

# Install npm dependencies
install_deps() {
    echo ""
    echo "Installing dependencies (this may take a minute)..."
    cd "$SCRIPT_DIR"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Set up .env.local
setup_env() {
    echo ""
    if [ -f "$SCRIPT_DIR/.env.local" ]; then
        echo -e "${GREEN}✓ .env.local already exists${NC}"
    else
        cp "$SCRIPT_DIR/.env.local.example" "$SCRIPT_DIR/.env.local"
        echo -e "${YELLOW}⚠ Created .env.local from template${NC}"
        echo "  The site will work with sample data for now."
        echo "  To use live Shopify data, edit .env.local and add your token."
    fi
}

# Ensure scripts are executable
set_permissions() {
    echo ""
    chmod +x "$SCRIPT_DIR/start.sh" "$SCRIPT_DIR/stop.sh" 2>/dev/null || true
    echo -e "${GREEN}✓ Scripts ready${NC}"
}

# Main installation
main() {
    check_node
    check_npm
    install_deps
    setup_env
    set_permissions

    echo ""
    echo "=============================================="
    echo -e "${GREEN}  Installation Complete!${NC}"
    echo "=============================================="
    echo ""
    echo "To start the site:"
    echo ""
    echo -e "  ${YELLOW}./start.sh${NC}"
    echo ""
    echo "Then open http://localhost:3000 in your browser."
    echo ""
    echo "To stop the site:"
    echo ""
    echo -e "  ${YELLOW}./stop.sh${NC}"
    echo ""
    echo "To use live Shopify product data instead of samples,"
    echo "edit .env.local and set your Storefront API token."
    echo ""
}

main
