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
| `firebase.json` with SPA rewrites | ✅ |
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

### Frontend (Firebase)
| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | ✅ Yes | `https://career-sethu.onrender.com` |

> [!IMPORTANT]
> `VITE_API_URL` must NOT have a trailing slash.
> ❌ `https://career-sethu.onrender.com/`
> ✅ `https://career-sethu.onrender.com`

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
| **Name** | `career-sethu` |
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
3. You will get a URL like: `https://career-sethu.onrender.com`

### Step 6: Verify Backend
Visit your Render URL. You should see:
```json
{ "status": "Career Sethu Backend Running", "timestamp": "..." }
```

Also visit: `https://career-sethu.onrender.com/health`
Expected: `{ "status": "ok" }`

> [!WARNING]
> Render free tier spins down after 15 minutes of inactivity. The first request after idle may take 30-60 seconds. This is normal.

---

## Phase B — Deploy Frontend to Firebase Hosting

### Step 1: Install Firebase CLI
Make sure you have the Firebase CLI installed:
```bash
npm install -g firebase-tools
```

### Step 2: Log in to Firebase CLI
Log in using the Google account associated with your Firebase project:
```bash
firebase login
```

### Step 3: Configure Environment File
Create or update `frontend/.env.production` in the frontend root:
```env
VITE_API_URL=https://career-sethu.onrender.com
```
*(Make sure to replace `https://career-sethu.onrender.com` with the actual URL from your Render backend deployment)*

### Step 4: Build the Frontend
Navigate to the `frontend` folder and run the build command. Vite will automatically load `.env.production` and compile your assets into `frontend/dist`:
```bash
cd frontend
npm run build
cd ..
```

### Step 5: Deploy to Firebase Hosting
Run the deployment command from the project root:
```bash
firebase deploy
```
Firebase Hosting will build and deploy the React application. Once completed, it will output your Hosting URL:
`https://careersethu-682fa.web.app`

---

## Phase C — Connect Frontend ↔ Backend

### Step 1: Update Render CORS
Now that your Firebase Hosting site is deployed:

1. Go to your **Render Dashboard** and select your backend Web Service.
2. Click on the **Environment** tab.
3. Update the `FRONTEND_URL` environment variable:
   - Set it to your Firebase Hosting URL: `https://careersethu-682fa.web.app`
4. Click **Save Changes**.
5. Render will automatically trigger a new deployment to apply the updated CORS settings.

### Step 2: Verify Full Connectivity
1. Visit your live Firebase Hosting URL (`https://careersethu-682fa.web.app`).
2. Open **Developer Tools → Console** (F12).
3. Complete the onboarding questionnaire and submit.
4. Verify that the form submits successfully, no CORS errors appear in the console, and your Career intelligence dashboard renders all cards using data fetched from the Render backend.

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
- Ensure `FRONTEND_URL` on Render exactly matches your Firebase Hosting URL (no trailing slash).
- After updating env vars on Render, wait for the redeploy to finish.

### Dashboard shows "No data" after onboarding
- Check that `VITE_API_URL` on `.env.production` has no trailing slash.
- Check Render logs: Render Dashboard → your service → "Logs" tab.

### Backend takes 30+ seconds to respond
- Render free tier spins down after inactivity. The first "cold start" request is slow. This is expected on the free plan.

### MongoDB connection failure on Render
- Ensure your MongoDB Atlas cluster has **Network Access** set to allow connections from `0.0.0.0/0` (allow all IPs), since Render's IP changes.

---

## Public URLs (fill in after deployment)

| Service | URL |
|---------|-----|
| Backend (Render) | `https://career-sethu.onrender.com` |
| Frontend (Firebase) | `https://careersethu-682fa.web.app` |
| Health Check | `https://career-sethu.onrender.com/health` |
