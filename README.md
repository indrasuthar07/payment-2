# Payment System

A full-stack payment system built with React frontend and Node.js backend, featuring user authentication, transaction management, and QR code generation.

## 🚀 Features

- **User Authentication**: Secure login/register with JWT
- **Transaction Management**: Send and receive payments
- **QR Code Generation**: Generate QR codes for payments
- **Real-time Balance**: Track account balance
- **Responsive Design**: Works on desktop and mobile
- **Secure API**: Protected routes with middleware

## 🛠️ Tech Stack

### Frontend
- React 18
- Redux Toolkit
- Ant Design
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs

## 📋 Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- MongoDB (local or Atlas)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PAYMENT-SYSTEM
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Environment Setup

#### Backend Environment
Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/payment-system
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment
Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start Development Servers
```bash
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000) servers.

## 🏗️ Project Structure

```
PAYMENT-SYSTEM/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store & actions
│   │   └── App.js       # Main app component
│   └── package.json
├── render.yaml          # Render deployment config
└── package.json         # Root package.json
```

## 🌐 Deployment on Render

### 1. Prepare for Deployment

1. **Push your code to GitHub**
2. **Set up MongoDB Atlas** (recommended for production)
3. **Generate a strong JWT secret**

### 2. Deploy Backend

1. **Go to Render Dashboard**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `payment-system-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `FRONTEND_URL`: Your frontend URL (will be set after frontend deployment)

### 3. Deploy Frontend

1. **Go to Render Dashboard**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `payment-system-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

5. **Add Environment Variables:**
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://payment-system-backend.onrender.com`)

### 4. Update URLs

After both services are deployed:
1. **Update backend's `FRONTEND_URL`** to your frontend URL
2. **Update frontend's `REACT_APP_API_URL`** to your backend URL

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development
- `npm run install-all` - Install dependencies for all packages
- `npm run build` - Build frontend for production

### Backend
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production

### Frontend
- `npm start` - Start frontend development server
- `npm run build` - Build for production

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation

## 📱 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction

### QR Code
- `POST /api/qrcode/generate` - Generate QR code
- `GET /api/qrcode/:id` - Get QR code details

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URI
   - Ensure MongoDB is running (if local)
   - Verify network access (if Atlas)

2. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Ensure frontend URL is correct

3. **Build Failures**
   - Check Node.js version (>= 16.0.0)
   - Clear node_modules and reinstall
   - Check for missing dependencies

### Development Tips

- Use `npm run dev` for development
- Check console logs for errors
- Use browser dev tools for frontend debugging
- Monitor network requests in browser

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, please open an issue on GitHub or contact the development team.
