// Root-level server file for deployment
const path = require('path');

// Check if we're in production (Render)
if (process.env.NODE_ENV === 'production') {
  // In production, serve the backend
  require('./backend/server.js');
} else {
  // In development, just log that this is the root server
  console.log('🚀 Payment System - Development Mode');
  console.log('📁 Use "npm run dev" to start both frontend and backend');
  console.log('🔧 Backend: cd backend && npm run dev');
  console.log('🎨 Frontend: cd frontend && npm start');
} 