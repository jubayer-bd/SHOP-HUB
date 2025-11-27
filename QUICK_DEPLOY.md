# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Step 1: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Add environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Railway will give you a URL like: `https://your-app.railway.app`
7. Copy this URL - you'll need it for the frontend

#### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project" → Import your GitHub repo
3. Vercel will auto-detect Next.js
4. Add environment variables:
   ```
   AUTH_SECRET=your-generated-secret
   AUTH_URL=https://your-app.vercel.app
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
5. Click "Deploy"
6. Done! Your site is live

---

### Option 2: Render (Full Stack)

1. Go to [render.com](https://render.com) and sign up
2. Create two services:

   **Backend Service:**
   - New → Web Service
   - Connect GitHub repo
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node
   - Add environment variables:
     ```
     PORT=3001
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend.onrender.com
     ```

   **Frontend Service:**
   - New → Web Service
   - Connect GitHub repo
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Environment: Node
   - Add environment variables:
     ```
     AUTH_SECRET=your-secret
     AUTH_URL=https://your-frontend.onrender.com
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
     GOOGLE_CLIENT_ID=your-id
     GOOGLE_CLIENT_SECRET=your-secret
     ```

3. Deploy both services
4. Update OAuth redirect URLs in Google/GitHub console

---

## 📋 Pre-Deployment Checklist

- [ ] Generate new AUTH_SECRET: `openssl rand -base64 32`
- [ ] Update OAuth redirect URLs in provider dashboards
- [ ] Set all environment variables in deployment platform
- [ ] Test production build locally: `npm run build && npm run start`
- [ ] Update CORS in server.js if needed

---

## 🔧 Environment Variables Reference

### Frontend (.env.local or Vercel/Render)
```env
AUTH_SECRET=your-secret-here
AUTH_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend (Railway/Render)
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

---

## 🐛 Common Issues

### CORS Error
Update `FRONTEND_URL` in backend environment variables to match your frontend URL.

### API Not Working
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend is running and accessible
- Check CORS settings in server.js

### Authentication Not Working
- Verify `AUTH_SECRET` is set
- Check OAuth redirect URLs match your domain
- Ensure `AUTH_URL` and `NEXTAUTH_URL` match your frontend URL

---

## 📚 Need More Details?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

