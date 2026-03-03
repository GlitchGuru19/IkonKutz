# Backend Documentation - Firebase

Ikon Cuts uses **Firebase** as the Backend-as-a-Service platform. This provides:
- Cloud authentication (Email/Password)
- NoSQL database (Firestore)
- Real-time data synchronization
- Automatic backups and scalability

## Firebase Services Used

### 1. Firebase Authentication

Handles user login and registration.

- **Method**: Email/Password authentication
- **Implementation**: `src/firebase.ts` exports auth functions
- **Security**: Passwords hashed and managed by Firebase
- **Session**: Auth state persisted locally in browser

### 2. Firestore Database

NoSQL cloud database for storing all application data.

#### Collections Overview

| Collection | Purpose | Access Control |
|---|---|---|
| `users` | User profiles and roles | Read/write own data, admins see all |
| `services` | Barber services catalog | All read, admin write |
| `slots` | Available time slots | All read, admin write |
| `appointments` | Customer bookings | Users see own, admins see all |

## Database Operations

All database operations are abstracted in `src/api.ts`:

### User Operations

```typescript
// Sign up new user
signupUser(email: string, password: string, displayName: string): Promise<User>

// Login existing user
loginUser(email: string, password: string): Promise<User>

// Get current authenticated user
getCurrentUser(): Promise<User | null>

// Logout
logoutUser(): Promise<void>
```

### Service Operations

```typescript
// Fetch all services
getServices(): Promise<Service[]>

// Add new service (admin only)
addService(service: Service): Promise<string>  // returns service ID

// Delete service (admin only)
deleteService(id: string): Promise<void>
```

### Slot Operations

```typescript
// Get slots for a specific date
getSlotsByDate(date: string): Promise<Slot[]>

// Create new slot
addSlot(slot: Slot): Promise<string>  // returns slot ID

// Update slot (book or lock)
updateSlot(id: string, updates: Partial<Slot>): Promise<void>
```

### Appointment Operations

```typescript
// Create new appointment
addAppointment(appointment: Appointment): Promise<string>

// Get user's appointments
getUserAppointments(userId: string): Promise<Appointment[]>

// Get all appointments (admin)
getAllAppointments(): Promise<Appointment[]>
```

## Firestore Security Rules

Default rules on new Firebase projects allow read/write for authenticated users. For production, update rules in Firebase Console to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Services readable by all, writable by admins only
    match /services/{document=**} {
      allow read: if request.auth != null;
      allow write: if isAdmin(request.auth.uid);
    }
    
    // Similar rules for slots and appointments
  }
  
  function isAdmin(uid) {
    return get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin';
  }
}
```

## Real-Time Updates

Firestore provides real-time listeners that automatically update the UI when data changes:

```typescript
const unsubscribe = onSnapshot(query(collection(db, 'slots')), (snapshot) => {
  // UI updates automatically when slots change
});
```

## Setup & Configuration

See [authentication.md](authentication.md) for:
- Creating a Firebase project
- Getting API credentials
- Configuring Firebase in the app
- Creating admin accounts
