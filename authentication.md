# Authentication & Firebase Setup

## Prerequisites

- Google account (for Firebase Console)
- Node.js and npm installed locally

## Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** and name it "Ikon Cuts"
3. Enable Google Analytics (optional)
4. Create the project

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"**
3. In **"Sign-in methods"** tab:
   - Click **"Email/Password"**
   - Enable both "Email/Password" and "Email link (passwordless)"
   - Click **Save**

## Step 3: Set Up Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development
   - *(For production, use security rules from Backend.md)*
4. Select your region (closest to your location)
5. Click **Enable**

## Step 4: Register Web App

1. Go to **Project Settings** (gear icon, top-right)
2. In **"Your apps"** section, click **"Web"** icon
3. Register app as "Ikon Cuts Web"
4. You'll see the `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "ikon-cuts.firebaseapp.com",
     projectId: "ikon-cuts",
     storageBucket: "ikon-cuts.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcd1234"
   };
   ```
5. **Copy this entire object**

## Step 5: Configure Local App

1. Open `src/firebase.ts` in your editor
2. Find the `firebaseConfig` variable
3. Replace it with your copied configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
4. Save the file

## Step 6: Create Admin Account

Normally, users sign up as "customer". To create an admin:

### Option A: Manual Database Edit (Easiest)

1. Sign up in the app with your email
2. In Firebase Console, go to **Firestore Database**
3. Click on **`users`** collection
4. Find your user document (matches your email or UID)
5. Click on the document to open it
6. Find the `role` field
7. Change value from `"customer"` to `"admin"`
8. **Refresh the app** in your browser
9. You should now see the **"Admin Dashboard"** option

### Option B: Programmatic Creation

Add a temporary script in your app to create admin (then remove it):

```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Call once, then remove
await updateDoc(doc(db, 'users', 'YOUR_USER_UID'), {
  role: 'admin'
});
```

## Troubleshooting

### "Authentication Error" on signup/login
- Verify `firebaseConfig` in `src/firebase.ts` matches Firebase Console
- Check that Email/Password is enabled in Firebase Authentication settings
- Clear browser cache and try again

### Admin Dashboard not visible
- Go to Firebase Console → Firestore Database → `users` collection
- Verify your user document has `role: "admin"` (not `"customer"`)
- Refresh the app in browser

### Firestore permission denied errors
- Check your database is in **"test mode"** (for development)
- Or update Firestore rules (see Backend.md for production rules)
- Verify you're logged in (`request.auth != null` checks this)

## Security Best Practices

- **Never commit** `firebaseConfig` with real credentials to public repos
- **Use environment variables** in production:
  ```typescript
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    // ...
  };
  ```
- **Update Firestore rules** before deploying to production (see Backend.md)
- **Restrict authentication** to Email/Password only (disable email link if unused)
