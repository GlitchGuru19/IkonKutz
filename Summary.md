# Project Summary - Ikon Cuts

## Project Overview

Ikon Cuts is a professional barber shop booking system. It allows customers to browse services, view real-time availability, and book appointments. Admins can manage services, create/block time slots, and view all bookings.

## Requirements & Features

### ✅ Core Features

**Barber Booking Service**
- Single barber scheduling system
- Real-time slot availability
- Appointment confirmation and history

**Customer Capabilities**
- User authentication (sign up / login)
- Browse services with pricing
- View available time slots (Saturday/Sunday only)
- Book appointments
- View booking history

**Admin Capabilities**
- Manage service catalog (add, edit, delete services)
- Generate time slot schedules
- Block/unlock specific time slots
- View all customer bookings
- Manage admin role assignments

### 📅 Schedule Logic

- **Operating Hours**: 08:00 - 17:00 (configurable)
- **Available Days**: Saturday & Sunday only (configurable)
- **Time Slot Duration**: 50 minutes (configurable)
- **Lunch Break**: 40 minutes around 12:00 (automatic gap)

### 🛠 Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, CSS Variables |
| Routing | React Router |
| State | React Context API |
| Backend | Firebase (Auth + Firestore) |
| Deployment | Vite build output |

## Customization Guide

### Change App Configuration

Edit `src/config.ts` to modify:

```typescript
export const APP_NAME = "Ikon Cuts";           // App title
export const OPEN_HOURS = { start: 8, end: 17 };  // Operating hours
export const SLOT_DURATION = 50;               // Minutes per slot
export const LUNCH_BREAK = 40;                 // Lunch duration
export const LUNCH_START = 12;                 // Lunch start hour
```

### Update Color Scheme

Edit `src/index.css` CSS variables section:

```css
:root {
  --color-bg: #0f172a;           /* Background */
  --color-primary: #cbd5e1;      /* Primary color */
  --color-accent: #f59e0b;       /* Accent (gold) */
  --color-text-main: #f8fafc;    /* Main text */
  /* ... more colors ... */
}
```

### Modify Type Definitions

Edit `src/types.ts` to extend data models:

```typescript
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
  // Add custom fields here
}
```

## Deployment

### Build for Production

```bash
npm run build
```

Output files are in the `dist/` directory.

### Deploy Options

1. **Firebase Hosting** (recommended - same account)
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

2. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Netlify**
   - Connect GitHub repo to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Traditional Hosting**
   - Upload `dist/` folder contents to your web server
   - Configure server for SPA (redirect 404s to index.html)

## Project Structure

See [Architecture.md](Architecture.md) for detailed component and data model documentation.

## Getting Started

1. Install dependencies: `npm install`
2. Set up Firebase (see [authentication.md](authentication.md))
3. Run dev server: `npm run dev`
4. Create admin account (see authentication.md)
5. Customize as needed

## Support Documents

- [README.md](README.md) - Getting started and features
- [Architecture.md](Architecture.md) - Technical architecture and components
- [Backend.md](Backend.md) - Firebase setup and API documentation
- [authentication.md](authentication.md) - Auth configuration guide

## Key Configuration Files

- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - CSS processing configuration
- `package.json` - Dependencies and npm scripts
