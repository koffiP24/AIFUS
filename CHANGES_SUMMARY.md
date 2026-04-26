# Configuration Changes Summary - Backend Connection Fix

## Issue
User reported "Connexion impossible - Erreur serveur" when trying to connect/login. The frontend was configured to use the remote backend (https://aifus.onrender.com/api) instead of the local backend.

## Files Modified

### 1. backend/.env
**Changes:**
- `FRONTEND_URL`: Changed from `https://ariyah-infiltrative-thriftlessly.ngrok-free.dev` to `http://localhost:5173`
- `FRONTEND_URLS`: Changed from `https://aifus.onrender.com` to `http://localhost:5173,http://localhost:4173`

**Purpose:** Allows frontend running on localhost to connect to the backend (CORS configuration).

### 2. frontend/.env
**Changes:**
- `VITE_API_BASE_URL`: Changed from `https://aifus.onrender.com/api` to `/api`

**Purpose:** Uses Vite dev server proxy to forward `/api` requests to `http://localhost:5000` (see vite.config.js proxy configuration).

### 3. README.md
**Changes:**
- Added note in the frontend environment section explaining that `/api` uses Vite proxy in development mode.

## New Files Created

### FIX_LOCAL_DEV.md
Detailed guide explaining the fix, how to start local development, verification steps, and troubleshooting.

## Technical Details

### Backend CORS Configuration (backend/src/app.js)
The backend already allows:
- `http://localhost:5173`, `http://127.0.0.1:5173`
- `http://localhost:4173`, `http://127.0.0.1:4173`
- `.ngrok-free.dev` and `.vercel.app` domains
- Any localhost/127.0.0.1 origin (lines 70-75)

### Frontend Proxy (vite.config.js)
In development mode (`npm run dev`):
- `/api` → `http://localhost:5000` (via Vite proxy)

In production mode:
- Uses `VITE_API_BASE_URL` from `.env` directly

## How to Start Development

### Using Root Scripts (Recommended)
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend  
npm run dev:frontend
```

### Manual
```bash
# Terminal 1
cd backend && npm run dev  # http://localhost:5000

# Terminal 2
cd frontend && npm run dev # http://localhost:5173
```

## Verification

✅ Backend health check:
```
curl http://localhost:5000/healthz
{"ok":true,"status":"healthy",...}
```

✅ Backend is running on port 5000
✅ Frontend .env uses `/api` (proxy)
✅ Backend .env allows localhost origins
✅ CORS configuration accepts localhost:5173

## Production Deployment

When deploying to Render/Vercel:

**Backend (.env on Render):**
```env
FRONTEND_URL=https://your-vercel-app.vercel.app
FRONTEND_URLS=https://your-vercel-app.vercel.app
```

**Frontend (.env on Vercel):**
```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

## Notes

- The backend server is already running and healthy
- MySQL database connection is working
- All migrations applied successfully
- No code changes required - only configuration updates
