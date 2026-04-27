# Fix for Local Dev: Backend Connection Issue

## Problem
The frontend was configured to connect to the remote backend (`https://aifus.onrender.com/api`) instead of the local backend (`http://localhost:5000`), causing "Connexion impossible - Erreur serveur" errors when trying to log in or use the application locally.

## Solution Applied

### 1. Backend Configuration (`backend/.env`)
Updated `FRONTEND_URL` and `FRONTEND_URLS` to allow localhost origins:
```env
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173,http://localhost:4173
```

**Note:** The backend CORS configuration (`backend/src/app.js`) already allows:
- `http://localhost:5173`, `http://127.0.0.1:5173`
- `http://localhost:4173`, `http://127.0.0.1:4173`
- Any `.ngrok-free.dev` and `.vercel.app` domains

### 2. Frontend Configuration (`frontend/.env`)
Set `VITE_API_BASE_URL` to use the Vite dev server proxy:
```env
VITE_API_BASE_URL=/api
```

**How it works:**
- When running `npm run dev` in `frontend/`, Vite uses `/api` as a proxy
- All `/api/*` requests are forwarded to `http://localhost:5000` (see `vite.config.js`)
- In production (Render/Vercel), this should be changed to the actual backend URL

## How to Start Local Development

### Option 1: Using Root npm Scripts (Recommended)
```bash
# From the project root:
npm run dev:backend  # Starts backend on port 5000
npm run dev:frontend # Starts frontend dev server on port 5173
```

### Option 2: Manual Start
```bash
# Terminal 1: Start backend
cd backend
npm run dev
# Backend runs on http://localhost:5000

# Terminal 2: Start frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## Verification

1. **Check backend health:**
   ```bash
   curl http://localhost:5000/healthz
   # Should return: {"ok":true,"status":"healthy",...}
   ```

2. **Test login endpoint:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

3. **Access the application:**
   - Open http://localhost:5173 in your browser
   - The frontend should be able to connect to the backend

## Production Deployment

When deploying to Render/Vercel:

1. **Backend (`backend/.env` on Render):**
   ```env
   FRONTEND_URL=https://your-vercel-app.vercel.app
   FRONTEND_URLS=https://your-vercel-app.vercel.app
   ```

2. **Frontend (`frontend/.env` on Vercel):**
   ```env
   VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
   ```

## Troubleshooting

**Issue: "Connexion impossible - Erreur serveur"**
- Ensure backend is running: `cd backend && npm run dev`
- Check backend health: `curl http://localhost:5000/healthz`
- Verify frontend `.env` has `VITE_API_BASE_URL=/api`
- Clear browser cache and localStorage

**Issue: CORS errors**
- Verify `backend/.env` has correct `FRONTEND_URL` settings
- The backend allows localhost by default (see `app.js` lines 70-75)

**Issue: MySQL connection errors**
- Ensure WAMP/XAMPP MySQL is running on port 3306
- Check `DATABASE_URL` in `backend/.env`
