# Project Summary - Ikon Cuts

## Requirements Met
- **Barber Booking Service**: Created a focused web app for "Ikon Cuts".
- **Single Barber Support**: Optimised for single-resource scheduling (slots).
- **Admin Capabilities**:
    - Add/Edit Services (Haircut, Line up, etc.)
    - Manage Bookings (View list)
    - Edit Times/Slots (Generate defaults, block dates)
- **Time/Schedule Logic**:
    - Sat/Sun only availability.
    - 50 min slots.
    - 40 min lunch break around 12:00.
    - 08:00 - 17:00 operational hours.
- **Customer Capabilities**:
    - View Services & Prices.
    - Sign Up / Log In.
    - Select Slot & Book.
- **Tech Stack**: React, Vite, TypeScript, Firebase.
- **Architecture**: Clean, Component-based, CSS variables for theming.

## Configuration
- Modify `src/config.ts` to change:
    - App Name (`APP_NAME`)
    - Opening Hours
    - Slot Duration
- Modify `src/index.css` to update:
    - Colors
    - Fonts
