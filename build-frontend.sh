#!/bin/bash

echo "🎨 Building Frontend for Production"
echo "=================================="

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the PAYMENT-SYSTEM root directory"
    exit 1
fi

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Navigate to frontend and install dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install

# Build the frontend
print_status "Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    print_error "Frontend build failed. Check for errors above."
    exit 1
fi

print_status "Frontend build completed successfully!"
print_status "Build directory: frontend/build"

# Go back to root
cd ..

echo ""
echo "🎉 Frontend is ready for deployment!"
echo "📁 Build directory: frontend/build"
echo "📋 Publish directory for Render: frontend/build" 