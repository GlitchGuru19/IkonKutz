# Architecture Documentation - Ikon Cuts

## Overview
Ikon Cuts is a Single Page Application (SPA) built with React, Vite, and TypeScript. It uses Firebase (v9 Modular SDK) for Backend-as-a-Service (BaaS), handling Authentication and Database (Firestore).

## Structure
- **Frontend**: React (Vite) + TypeScript
- **State Management**: React Context (`AuthContext`) + Local State
- **Router**: `react-router-dom`
- **Styling**: Vanilla CSS with CSS Variables (`src/index.css`) + Utility Classes
- **Backend**: Firebase Firestore
- **Auth**: Firebase Authentication

## Implementation Details

### Directory Structure
```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx      # Main wrapper with Nav
│   ├── Service...      # Service domain components
│   └── Schedule...     # Schedule domain components
├── context/
│   └── AuthContext.tsx # User session management
├── pages/              # Route views
│   ├── AdminDashboard  # Protected admin view
│   ├── Booking         # Customer booking flow
│   ├── Login/Signup    # Auth pages
│   └── Home.tsx        # Landing
├── config.ts           # App constants (Hours, Prices, etc.)
├── firebase.ts         # Firebase initialization
├── types.ts            # TypeScript interfaces
└── main.tsx            # Entry point & Routing
```

### Data Models (Firestore)
**Users (`users/{uid}`)**
- `role`: 'admin' | 'customer'
- `email`: string
- `displayName`: string

**Services (`services/{id}`)**
- `name`: string
- `price`: number
- `durationMinutes`: number

**Slots (`slots/{id}`)**
- `date`: YYYY-MM-DD
- `time`: HH:mm
- `isBooked`: boolean
- `isLocked`: boolean (Admin override)

**Appointments (`appointments/{id}`)**
- Links `customerId`, `serviceId` with `date` and `time`.

### Key Workflows
1.  **Booking Flow**: Customer selects Service -> Selects unbooked Slot -> Creates Appointment -> Updates Slot to `isBooked`.
2.  **Admin Flow**: Admin generates Slots for days -> Slots stored in DB -> Admin manages Services.
