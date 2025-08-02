#!/bin/bash

echo "🔨 Payment System Production Build"
echo "=================================="

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the PAYMENT-SYSTEM root directory"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check environment files
if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Creating from example..."
    if [ -f "backend/env.example" ]; then
        cp backend/env.example backend/.env
        print_warning "Please update backend/.env with your production configuration"
    else
        print_error "backend/env.example not found. Please create backend/.env manually"
    fi
fi

if [ ! -f "frontend/.env" ]; then
    print_warning "Frontend .env file not found. Creating..."
    echo "REACT_APP_API_URL=http://localhost:5000" > frontend/.env
    print_warning "Please update frontend/.env with your production API URL"
fi

# Build frontend
print_status "Building frontend for production..."
cd frontend
npm run build
cd ..

# Check if build was successful
if [ ! -d "frontend/build" ]; then
    print_error "Frontend build failed. Check for errors above."
    exit 1
fi

print_status "Frontend build completed successfully!"

# Create deployment package
print_status "Creating deployment package..."
mkdir -p deployment
cp -r backend deployment/
cp -r frontend/build deployment/frontend
cp render.yaml deployment/
cp package.json deployment/
cp README.md deployment/

# Remove unnecessary files from deployment
rm -rf deployment/backend/node_modules
rm -rf deployment/backend/.env
rm -rf deployment/frontend/node_modules

print_status "Deployment package created in ./deployment/"

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps for deployment:"
echo "1. Update environment variables in backend/.env"
echo "2. Update REACT_APP_API_URL in frontend/.env"
echo "3. Push code to GitHub"
echo "4. Deploy to Render using the render.yaml configuration"
echo ""
echo "📖 See README.md for detailed deployment instructions" 