# 🔥 Firebase Google Authentication — Setup Guide

This guide walks you through enabling real Google Sign-In for Career Sethu. The application already has full Firebase Auth integration code — you just need to create a Firebase project and configure the keys.

---

## Prerequisites

- A Google account
- Access to the [Firebase Console](https://console.firebase.google.com)

---

## Step 1: Create a Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com)**
2. Click **"Create a project"** (or "Add project")
3. Enter project name: `career-sethu` (or any name you prefer)
4. Disable Google Analytics (optional — not needed for auth)
5. Click **"Create project"**
6. Wait for provisioning, then click **"Continue"**

---

## Step 2: Register a Web App

1. On the project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Career Sethu Web`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **"Register app"**
5. Firebase will display a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "career-sethu.firebaseapp.com",
  projectId: "career-sethu",
  storageBucket: "career-sethu.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

6. **Copy these values** — you'll need them in Step 4.
7. Click **"Continue to console"**

---

## Step 3: Enable Google Sign-In Method

1. In the Firebase Console sidebar, go to **Build → Authentication**
2. Click **"Get started"** (if first time)
3. Go to the **"Sign-in method"** tab
4. Click **"Google"** from the provider list
5. Toggle **"Enable"** to ON
6. Set a project support email (use your Google account email)
7. Click **"Save"**

### Add Authorized Domains (for production)

1. Still in Authentication, go to the **"Settings"** tab
2. Under **"Authorized domains"**, ensure these are listed:
   - `localhost` (should be added by default)
   - Your production frontend domain (e.g., `career-sethu.vercel.app`)
3. Click **"Add domain"** if your production URL is missing

---

## Step 4: Configure Environment Variables

### Local Development (`frontend/.env`)

Open `frontend/.env` and replace the placeholder values with your Firebase config:

```env
VITE_API_URL=http://localhost:5000

# Firebase Configuration (from Step 2)
VITE_FIREBASE_API_KEY=AIzaSy...your-actual-key...
VITE_FIREBASE_AUTH_DOMAIN=career-sethu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=career-sethu
VITE_FIREBASE_STORAGE_BUCKET=career-sethu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### Production (`frontend/.env.production`)

Open `frontend/.env.production` and add the same Firebase keys:

```env
VITE_API_URL=https://career-sethu.onrender.com

# Firebase Configuration (same keys as local)
VITE_FIREBASE_API_KEY=AIzaSy...your-actual-key...
VITE_FIREBASE_AUTH_DOMAIN=career-sethu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=career-sethu
VITE_FIREBASE_STORAGE_BUCKET=career-sethu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### Vercel Environment Variables (if hosting on Vercel)

If your frontend is deployed on Vercel:
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add each `VITE_FIREBASE_*` variable with its value
3. Redeploy the frontend

---

## Step 5: Restart and Verify

1. Restart the frontend dev server:
   ```bash
   cd frontend && npm run dev
   ```

2. Navigate to `http://localhost:5173/`

3. You should now see the **"Continue with Google"** button

4. Click it — a real Google Sign-In popup should appear (instead of the Mock Identity Portal)

5. After signing in:
   - Your Google profile photo should appear in the sidebar
   - Your email should appear in Settings
   - You should be redirected to the onboarding form (first-time users) or the dashboard (returning users)

---

## How It Works (Technical Reference)

The auth flow is handled by these existing files — **no code changes are needed**:

| File | Role |
|------|------|
| `frontend/src/services/firebase.js` | Initializes Firebase. If keys are valid → real auth. If placeholder keys → Mock Auth mode. |
| `frontend/src/context/AuthContext.jsx` | Manages global auth state. Listens to `onAuthStateChanged`. Calls `POST /api/users/login` to sync with MongoDB. |
| `frontend/src/components/common/ProtectedRoute.jsx` | Route guard — redirects unauthenticated users to `/`. |
| `backend/controllers/userController.js` | `loginUser` — finds or creates user by email in MongoDB. |

### Auth Detection Logic (`firebase.js`)

```javascript
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY_HERE" &&
  firebaseConfig.apiKey.trim() !== ""
);
```

- If `isFirebaseConfigured === true` → Real Firebase Google Auth
- If `isFirebaseConfigured === false` → Mock Identity Portal

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Popup blocked" | Allow popups for `localhost` in your browser |
| "auth/unauthorized-domain" | Add your domain to Firebase Console → Authentication → Settings → Authorized domains |
| "auth/configuration-not-found" | Verify the project ID matches between Firebase Console and your `.env` |
| Still seeing Mock Auth | Ensure `VITE_FIREBASE_API_KEY` is not set to `YOUR_FIREBASE_API_KEY_HERE`. Restart the dev server after changing `.env` |
| Google popup closes without signing in | Ensure Google Sign-In is enabled in Firebase Console → Authentication → Sign-in method |

---

## Security Notes

- Firebase API keys are **safe to expose** in client-side code — they are restricted by Firebase Security Rules and authorized domains
- The `.env` files are `.gitignore`'d and will not be committed to the repository
- In production, set the keys via your hosting provider's environment variable system (Vercel, Netlify, etc.)
