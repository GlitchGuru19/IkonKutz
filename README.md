# Ikon Cuts

Premium barber booking web application built with React, TypeScript, and Firebase.

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Backend**: Firebase (Authentication + Firestore Database)
- **Routing**: React Router
- **State Management**: React Context API

## Prerequisites

- Node.js 16+ and npm
- Firebase account (free tier supported)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Firebase

1. Follow the detailed steps in [authentication.md](authentication.md) to set up Firebase.
2. Update `src/firebase.ts` with your Firebase configuration.
3. Create an admin account (detailed instructions in [authentication.md](authentication.md)).

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

Output files are in the `dist/` directory.

## Features

### Customer Features
- Browse available barber services with pricing
- View real-time availability (Saturday/Sunday only)
- User authentication and profile management
- Book appointments with confirmed booking history

### Admin Features
- Add, edit, and delete barber services
- Generate and manage time slot availability
- View all bookings and customer details
- Lock/unlock specific time slots

## Configuration

Customize the app by editing:

- **App Settings**: `src/config.ts` (name, hours, slot duration, prices)
- **Styling**: `src/index.css` (colors, fonts, spacing)
- **Type Definitions**: `src/types.ts` (data models)

## Project Structure

See [Architecture.md](Architecture.md) for detailed information about:
- Component organization
- Data models and Firestore schema
- Key workflows and user flows

## Documentation

- [Architecture.md](Architecture.md) - Technical architecture and data models
- [authentication.md](authentication.md) - Firebase setup and admin account creation
- [Backend.md](Backend.md) - Firebase services and database API
- [Summary.md](Summary.md) - Project requirements and features overview

## Troubleshooting

**Firebase connection issues**: Ensure your `firebaseConfig` in `src/firebase.ts` is correct.

**Admin dashboard not visible**: Verify your user role is set to `"admin"` in Firestore Users collection.

**Build fails**: Clear `node_modules` and `package-lock.json`, then run `npm install` again.
