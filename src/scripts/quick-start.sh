#!/bin/bash

# VHV CMS Quick Start Script
# This script helps you get started quickly

set -e

echo "🚀 VHV CMS Quick Start"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be >= 18.0.0${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm is not installed${NC}"
    echo "Installing pnpm..."
    npm install -g pnpm
fi

echo -e "${GREEN}✅ pnpm $(pnpm -v)${NC}"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    
    if [ -f .env.development ]; then
        echo "Copying .env.development to .env..."
        cp .env.development .env
        echo -e "${GREEN}✅ .env created${NC}"
    elif [ -f .env.example ]; then
        echo "Copying .env.example to .env..."
        cp .env.example .env
        echo -e "${GREEN}✅ .env created${NC}"
    else
        echo -e "${RED}❌ No .env template found${NC}"
        echo "Please create .env manually"
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Type check
echo "🔍 Running TypeScript type check..."
pnpm type-check

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  TypeScript errors found (non-critical)${NC}"
else
    echo -e "${GREEN}✅ TypeScript check passed${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start development server:"
echo "   ${YELLOW}pnpm dev${NC}"
echo ""
echo "2. Open browser:"
echo "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "3. Configure backend API in .env:"
echo "   ${YELLOW}VITE_API_URL=http://your-backend-url${NC}"
echo ""
echo "4. Review documentation:"
echo "   - README.md - Project overview"
echo "   - SETUP_INSTRUCTIONS.md - Detailed setup"
echo "   - TESTING_CHECKLIST.md - Testing guide"
echo "   - FRAMEWORK_INTEGRATION.md - Framework details"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Happy coding!"
echo ""

# Ask to start dev server
read -p "Start development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting development server..."
    pnpm dev
fi
