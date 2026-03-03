# Authentication & Firebase Setup

## 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project "Ikon Cuts".
3. **Authentication**:
   - Enable "Email/Password" sign-in method.
4. **Firestore Database**:
   - Create Database (Start in test mode or production mode).
   - If in production mode, update Rules to allow read/write for now or simpler auth rules:
     ```
     allow read, write: if request.auth != null;
     ```
5. **Web App**:
   - Register a web app in Project Settings.
   - Copy the `firebaseConfig` object.

## 2. Connect to App
1. Open `src/firebase.ts`.
2. Replace the `firebaseConfig` object with your actual keys.
   ```typescript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     // ...
   };
   ```

## 3. Creating an Admin
The app distinguishes Admin by the `role` field in the `users` collection.
1. Sign up via the App (you will be a 'customer').
2. Go to Firebase Console -> Firestore -> `users` collection.
3. Find your user document (by ID or email).
4. Change the `role` field from `"customer"` to `"admin"`.
5. Refresh the app to access the **Admin Dashboard**.
