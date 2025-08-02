# 🚀 Payment System - Render Deployment Guide

## Quick Fix for Current Deployment Issue

The deployment is failing because dependencies aren't being installed properly. Here's the corrected approach:

## Method 1: Manual Deployment (Recommended)

### Step 1: Deploy Backend

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name**: `payment-system-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (deploy from root)

   **Build & Deploy:**
   - **Build Command**: 
     ```bash
     npm install
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

5. **Add Environment Variables:**
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secure JWT secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `FRONTEND_URL`: `https://your-frontend-url.onrender.com` (update after frontend deployment)

6. **Click "Create Web Service"**

### Step 2: Deploy Frontend

1. **Go to Render Dashboard**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name**: `payment-system-frontend`
   - **Environment**: `Static Site`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty

   **Build & Deploy:**
   -    **Build Command**: 
     ```bash
     npm install
     cd frontend
     npm install
     npm run build
     cp -r build ../build
     cd ..
     ```
   - **Publish Directory**: `build`

5. **Add Environment Variables:**
   - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com`

6. **Click "Create Static Site"**

### Step 3: Update URLs

After both services are deployed:
1. **Update backend's `FRONTEND_URL`** to your frontend URL
2. **Update frontend's `REACT_APP_API_URL`** to your backend URL
3. **Redeploy both services**

## Method 2: Using render.yaml (Alternative)

If you prefer using the render.yaml file:

1. **Use the updated `render.yaml`** in the root directory
2. **Deploy using Render's Blueprint feature**
3. **Follow the same environment variable setup**

## Environment Variables Setup

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment-system?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
PORT=5000
FRONTEND_URL=https://your-frontend-url.onrender.com
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
2. **Create a new cluster** (free tier)
3. **Create a database user**
4. **Get your connection string**
5. **Add your IP to whitelist** (or use 0.0.0.0/0 for all IPs)

## Troubleshooting

### Common Issues:

1. **"Cannot find module 'express'"**
   - Solution: Use the corrected build commands above
   - Ensure `npm install` runs in both root and backend directories

2. **Build fails**
   - Check Node.js version (>= 16.0.0)
   - Ensure all dependencies are in package.json
   - Check build logs in Render dashboard

3. **CORS errors**
   - Verify `FRONTEND_URL` is correct in backend environment
   - Check that URLs match exactly

4. **MongoDB connection fails**
   - Verify connection string format
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

### Debug Commands:

```bash
# Test locally
npm run install-all
npm run dev

# Check backend health
curl https://your-backend-url.onrender.com/api/health

# Check frontend build
cd frontend && npm run build
```

## Success Indicators

✅ **Backend**: Health check returns `{"status":"OK"}`
✅ **Frontend**: Loads without console errors
✅ **Authentication**: Can register/login users
✅ **Database**: Transactions are saved/retrieved

## Support

If you encounter issues:
1. Check Render build logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection 