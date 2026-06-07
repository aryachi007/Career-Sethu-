# Career-Sethu Deployment Guide

## Deployment Readiness Report

### Backend Checklist
| Check | Status |
|-------|--------|
| `PORT` uses `process.env.PORT` | ✅ |
| No hardcoded localhost URLs | ✅ |
| `npm start` script exists | ✅ |
| `engines.node` specified (`>=18`) | ✅ |
| CORS whitelists `FRONTEND_URL` env var | ✅ |
| Health check endpoint (`/health`) | ✅ |
| Binds to `0.0.0.0` for containers | ✅ |
| MongoDB uses `process.env.MONGODB_URI` | ✅ |
| Gemini uses `process.env.GEMINI_API_KEY` | ✅ |
| `.env.example` created | ✅ |

### Frontend Checklist
| Check | Status |
|-------|--------|
| Uses `VITE_API_URL` env variable | ✅ |
| No hardcoded localhost URLs | ✅ |
| `vercel.json` with SPA rewrites | ✅ |
| `.env.example` created | ✅ |
| `.gitignore` excludes `.env` and `dist/` | ✅ |

---

## Environment Variable Checklist

### Backend (Render)
| Variable | Required | Example |
|----------|----------|---------|
| `MONGODB_URI` | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/careersethu` |
| `GEMINI_API_KEY` | ✅ Yes | `AIzaSy...` |
| `FRONTEND_URL` | ✅ Yes | `https://career-sethu.vercel.app` |
| `PORT` | ❌ Auto | Set automatically by Render |
| `NODE_ENV` | ❌ Optional | `production` |

### Frontend (Vercel)
| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | ✅ Yes | `https://career-sethu-backend.onrender.com` |

> [!IMPORTANT]
> `VITE_API_URL` must NOT have a trailing slash.
> ❌ `https://career-sethu-backend.onrender.com/`
> ✅ `https://career-sethu-backend.onrender.com`

---

## Phase A — Deploy Backend to Render

### Step 1: Push Latest Code to GitHub
```bash
cd C:\Users\user07\Desktop\Career-Sethu
git add .
git commit -m "chore: production deployment configuration"
git push
```

### Step 2: Create Render Account & Service
1. Go to **https://render.com** and sign up (or log in).
2. Click **"New +"** in the top-right → Select **"Web Service"**.
3. Connect your **GitHub account** if not already connected.
4. Select the repository: **`aryachi007/Career-Sethu-`**.

### Step 3: Configure the Service
Fill in these exact values:

| Setting | Value |
|---------|-------|
| **Name** | `career-sethu-backend` |
| **Region** | Oregon (US West) or closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Step 4: Set Environment Variables
On the same page (or under "Environment" tab), click **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | *(copy your MongoDB Atlas connection string from `backend/.env`)* |
| `GEMINI_API_KEY` | *(copy your Gemini API key from `backend/.env`)* |
| `FRONTEND_URL` | *(leave blank for now — you will update this after deploying the frontend)* |
| `NODE_ENV` | `production` |

### Step 5: Deploy
1. Click **"Create Web Service"**.
2. Render will build and deploy. Wait 2-3 minutes.
3. You will get a URL like: `https://career-sethu-backend.onrender.com`

### Step 6: Verify Backend
Visit your Render URL. You should see:
```json
{ "status": "Career Sethu Backend Running", "timestamp": "..." }
```

Also visit: `https://career-sethu-backend.onrender.com/health`
Expected: `{ "status": "ok" }`

> [!WARNING]
> Render free tier spins down after 15 minutes of inactivity. The first request after idle may take 30-60 seconds. This is normal.

---

## Phase B — Deploy Frontend to Vercel

### Step 1: Create Vercel Account & Project
1. Go to **https://vercel.com** and sign up (or log in) with GitHub.
2. Click **"Add New..."** → **"Project"**.
3. Import the repository: **`aryachi007/Career-Sethu-`**.

### Step 2: Configure the Project
Vercel will auto-detect the Vite framework. Set:

| Setting | Value |
|---------|-------|
| **Project Name** | `career-sethu` |
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` *(click "Edit" to change this)* |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3: Set Environment Variable
Under **"Environment Variables"**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://career-sethu-backend.onrender.com` |

*(Use the exact Render URL you got from Phase A, Step 5)*

### Step 4: Deploy
1. Click **"Deploy"**.
2. Wait 1-2 minutes for the build.
3. You will get a URL like: `https://career-sethu.vercel.app`

### Step 5: Verify Frontend
Visit your Vercel URL. The Career-Sethu onboarding page should load.

---

## Phase C — Connect Frontend ↔ Backend

### Step 1: Update Render CORS
Now that you have the Vercel URL:

1. Go to **Render Dashboard** → your backend service.
2. Click **"Environment"** tab.
3. Update the `FRONTEND_URL` variable:
   - Set it to your Vercel URL, e.g., `https://career-sethu.vercel.app`
4. Click **"Save Changes"**.
5. Render will automatically redeploy with the new CORS setting.

### Step 2: Verify Full Connectivity
1. Open your Vercel URL in a browser.
2. Open **Developer Tools → Console** (F12).
3. Complete the onboarding form and submit.
4. If you see no CORS errors and the dashboard loads with data → **deployment is successful!**

---

## Phase D — Final Verification Checklist

Test each feature on the live deployment:

| # | Feature | Test Action | Expected Result |
|---|---------|-------------|-----------------|
| 1 | **Onboarding** | Fill form, submit | User created, redirected to dashboard |
| 2 | **Resume Upload** | Upload a PDF resume | Resume parsed, analysis displayed |
| 3 | **GitHub Analysis** | Enter a GitHub URL during onboarding | Profile analyzed, strengths shown |
| 4 | **Roadmap Generation** | Triggered during onboarding | AI roadmap displayed on dashboard |
| 5 | **Skill Gap Analysis** | Triggered via dashboard | Missing skills and readiness score shown |
| 6 | **Job Matching** | Click "Generate Job Matches" button | Three categories of jobs displayed |
| 7 | **Dashboard** | Load `/dashboard` | All cards populated from single API call |

---

## Troubleshooting

### "CORS error" in browser console
- Ensure `FRONTEND_URL` on Render exactly matches your Vercel URL (no trailing slash).
- After updating env vars on Render, wait for the redeploy to finish.

### Dashboard shows "No data" after onboarding
- Check that `VITE_API_URL` on Vercel has no trailing slash.
- Check Render logs: Render Dashboard → your service → "Logs" tab.

### Backend takes 30+ seconds to respond
- Render free tier spins down after inactivity. The first "cold start" request is slow. This is expected on the free plan.

### MongoDB connection failure on Render
- Ensure your MongoDB Atlas cluster has **Network Access** set to allow connections from `0.0.0.0/0` (allow all IPs), since Render's IP changes.

---

## Public URLs (fill in after deployment)

| Service | URL |
|---------|-----|
| Backend (Render) | `https://_____.onrender.com` |
| Frontend (Vercel) | `https://_____.vercel.app` |
| Health Check | `https://_____.onrender.com/health` |
