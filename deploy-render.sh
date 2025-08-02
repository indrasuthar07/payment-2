#!/bin/bash

echo "🚀 Payment System - Render Deployment Script"
echo "============================================"

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

print_status "Starting deployment preparation..."

# Install root dependencies (this includes backend dependencies)
print_status "Installing root dependencies..."
npm install

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Build frontend
print_status "Building frontend..."
cd frontend && npm run build && cd ..

print_status "Deployment preparation complete!"

echo ""
echo "🎉 Ready for Render deployment!"
echo ""
echo "📋 Deployment Instructions:"
echo ""
echo "1. BACKEND DEPLOYMENT:"
echo "   - Go to Render Dashboard"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Add environment variables:"
echo "     * NODE_ENV=production"
echo "     * MONGODB_URI=your_mongodb_connection_string"
echo "     * JWT_SECRET=your_jwt_secret"
echo "     * FRONTEND_URL=https://your-frontend-url.onrender.com"
echo ""
echo "2. FRONTEND DEPLOYMENT:"
echo "   - Go to Render Dashboard"
echo "   - Create new Static Site"
echo "   - Connect your GitHub repo"
echo "   - Build Command: npm install && cd frontend && npm install && npm run build"
echo "   - Publish Directory: frontend/build"
echo "   - Add environment variables:"
echo "     * REACT_APP_API_URL=https://your-backend-url.onrender.com"
echo ""
echo "3. UPDATE URLs:"
echo "   - After both are deployed, update the URLs in environment variables"
echo "   - Redeploy both services"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 