#!/bin/bash

echo "🚀 Payment System Deployment Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from example..."
    cp backend/env.example backend/.env
    echo "📝 Please update backend/.env with your configuration"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Creating..."
    echo "REACT_APP_API_URL=http://localhost:5000" > frontend/.env
    echo "📝 Please update frontend/.env with your configuration"
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend && npm run build && cd ..

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in backend/.env and frontend/.env"
echo "2. Push code to GitHub"
echo "3. Deploy to Render using render.yaml configuration"
echo ""
echo "🌐 For Render deployment:"
echo "- Backend: Web Service"
echo "- Frontend: Static Site"
echo ""
echo "📖 See README.md for detailed deployment instructions" 