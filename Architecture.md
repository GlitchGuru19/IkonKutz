# Architecture Documentation - Ikon Cuts

## Overview

Ikon Cuts is a Single Page Application (SPA) built with React, Vite, and TypeScript. It uses Firebase (v9 Modular SDK) for Backend-as-a-Service (BaaS), handling both Authentication and Database (Firestore).

## Technology Stack

- **Frontend Framework**: React 18 with Vite (fast bundler)
- **Language**: TypeScript for type safety
- **State Management**: React Context API (`AuthContext`) + Local component state
- **Routing**: React Router for SPA navigation
- **Styling**: Tailwind CSS + CSS Variables (`src/index.css`) with utility classes
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Authentication (Email/Password)

## Directory Structure

```
src/
├── components/
│   ├── Layout.tsx              # App wrapper with navigation bar
│   ├── BookingsList.tsx        # Display user appointment history
│   ├── ServiceManagement.tsx   # Admin: manage services (add/delete)
│   ├── ServiceSelection.tsx    # Customer: browse available services
│   ├── ScheduleManagement.tsx  # Admin: manage time slots and availability
│   └── SlotSelection.tsx       # Customer: select appointment time
├── context/
│   └── AuthContext.tsx         # Global authentication state provider
├── pages/
│   ├── Login.tsx               # User login page
│   ├── Signup.tsx              # New user registration page
│   ├── Dashboard.tsx           # Customer home/main dashboard
│   ├── AdminDashboard.tsx      # Admin control center (role-protected)
│   └── Booking.tsx             # Customer booking workflow entry point
├── api.ts                      # Firebase API calls and helpers
├── config.ts                   # App configuration (name, hours, prices)
├── firebase.ts                 # Firebase initialization and exports
├── types.ts                    # TypeScript interfaces and type definitions
├── App.tsx                     # Root component with routing setup
└── main.tsx                    # Application entry point
```

## Data Models (Firestore)

### Users Collection (`users/{uid}`)

```typescript
{
  uid: string;                    // Firebase Auth UID (document ID)
  email: string;                  // User email address
  displayName: string;            // Display name for UI
  role: 'admin' | 'customer';     // User role for access control
  phone?: string;                 // Phone number (optional)
  createdAt: Timestamp;           // Account creation date
}
```

### Services Collection (`services/{id}`)

```typescript
{
  id: string;                     // Service ID (document ID)
  name: string;                   // Service name (e.g., "Haircut", "Line Up")
  price: number;                  // Price in currency units
  durationMinutes: number;        // Duration of service in minutes
  description?: string;           // Service description (optional)
  createdAt: Timestamp;           // Creation date
}
```

### Slots Collection (`slots/{id}`)

```typescript
{
  id: string;                     // Slot ID (document ID)
  date: string;                   // Date in YYYY-MM-DD format
  time: string;                   // Time in HH:mm format (24-hour)
  isBooked: boolean;              // Whether slot is booked by a customer
  isLocked: boolean;              // Admin lock (prevents customer booking)
  bookedBy?: string;              // Customer UID who booked (optional)
  createdAt: Timestamp;           // Slot creation date
}
```

### Appointments Collection (`appointments/{id}`)

```typescript
{
  id: string;                     // Appointment ID (document ID)
  customerId: string;             // Customer UID
  customerName: string;           // Customer display name
  serviceId: string;              // Service ID reference
  serviceName: string;            // Service name (denormalized)
  date: string;                   // Appointment date (YYYY-MM-DD)
  time: string;                   // Appointment time (HH:mm)
  price: number;                  // Service price at time of booking
  status: 'confirmed' | 'cancelled';  // Appointment status
  createdAt: Timestamp;           // Booking creation date
}
```

## Key User Workflows

### 1. Customer Booking Flow

```
Sign up / Login
   ↓
Browse Services (view all with prices)
   ↓
Select a Service
   ↓
View Available Slots (filtered by date/duration)
   ↓
Select Time Slot
   ↓
Confirm Booking (creates Appointment, marks Slot as booked)
   ↓
View Booking History
```

### 2. Admin Management Flow

```
Login as Admin
   ↓
Access Admin Dashboard
   ├─ Manage Services (add, edit, delete)
   ├─ Generate Schedule (create time slots for dates)
   ├─ Manage Slots (lock/unlock specific times)
   └─ View Bookings (see all appointments)
```

## Component Responsibilities

### Layout Component
- Renders navigation header
- Handles logout button
- Wraps all page content with consistent styling

### ServiceSelection Component
- Fetches and displays all services
- Allows customers to select a service
- Shows service prices and descriptions
- Navigates to slot selection on selection

### SlotSelection Component
- Fetches available slots for selected service
- Filters slots by date and booking status
- Prevents selection of locked/booked slots
- Creates appointment on selection

### ScheduleManagement Component
- Generates time slots for selected date range
- Applies business logic (operating hours, lunch break)
- Allows admin to lock/unlock slots
- Displays slot status visually

### ServiceManagement Component
- CRUD operations for services
- Admin-only access
- Form validation for new services

### BookingsList Component
- Displays user's appointment history
- Shows appointment details (date, time, service, price)
- Allows cancellation if applicable

## State Management

### Global State (AuthContext)
- Current user object
- Authentication status
- Login/logout functions
- User role (for conditional rendering)

### Local Component State
- Form inputs in signup/login
- Selected service during booking
- Selected slot and date
- Creating status for async operations

## API Layer (api.ts)

The `api.ts` file abstracts all Firestore operations:

**User Operations**
- `signupUser()` - Create new user account
- `loginUser()` - Authenticate existing user
- `getCurrentUser()` - Get current auth user
- `logoutUser()` - End user session
- `makeUserAdmin()` - Promote user to admin (admin only)

**Service Operations**
- `getServices()` - Fetch all services
- `addService()` - Create new service (admin only)
- `updateService()` - Modify service details
- `deleteService()` - Remove service (admin only)

**Slot Operations**
- `getSlotsByDate()` - Fetch slots for specific date
- `addSlot()` - Create new time slot
- `updateSlot()` - Update slot booking/lock status
- `generateSlots()` - Batch create slots for date range

**Appointment Operations**
- `addAppointment()` - Create new booking
- `getUserAppointments()` - Get user's bookings
- `getAllAppointments()` - Get all bookings (admin)
- `cancelAppointment()` - Cancel booking if allowed

## Routing Structure

- `/` - Landing/home page
- `/login` - User login
- `/signup` - New user registration
- `/dashboard` - Customer main dashboard
- `/booking` - Booking workflow
- `/admin` - Admin dashboard (protected route)

## Error Handling

- Firebase errors caught and displayed to user
- Form validation before submission
- Loading states during async operations
- Fallback UI for missing data

## Performance Optimizations

- Lazy loading of components with React.lazy()
- Memoization of expensive computations
- Efficient re-renders with proper dependency arrays
- Indexed Firestore queries for fast lookups
