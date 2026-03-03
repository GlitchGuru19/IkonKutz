# Backend Documentation

This project uses a local JSON server to mock a backend REST API. The data is persisted in the `db.json` file located in the project root.

**Base URL:** `http://localhost:3000`

## Data Source
All data is stored in the `db.json` file. This file acts as the database.
- Modifying this file directly will update the data.
- The server automatically updates this file when operations (POST, PATCH, DELETE) are performed via the API.

## Endpoints

### 1. Users
Manages customer and admin accounts.

| Method | Endpoint | Description | Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | List all users or filter by criteria. | `?email=...&password=...` (Used for specific user lookup/login) |
| `POST` | `/users` | Create a new user account (Signup). | `{ id, email, password, displayName, phone, role, createdAt }` |

### 2. Services
Manages the list of barber services available for booking.

| Method | Endpoint | Description | Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/services` | Get a list of all available services. | - |
| `POST` | `/services` | Add a new service (Admin only). | `{ id, name, price, description, durationMinutes }` |
| `DELETE` | `/services/:id` | Remove a service (Admin only). | - |

### 3. Time Slots (`/slots`)
Manages the daily schedule and availability logic.

| Method | Endpoint | Description | Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/slots` | Get time slots. Typically filtered by date. | `?date=YYYY-MM-DD` |
| `POST` | `/slots` | Create a new time slot (used by Admin "Generate Schedule"). | `{ id, date, time, isBooked, isLocked }` |
| `PATCH` | `/slots/:id` | Update a slot's status (Book or Lock/Unlock). | `{ isBooked: boolean, bookedBy: userId }` OR `{ isLocked: boolean }` |

### 4. Appointments
Manages confirmed bookings.

| Method | Endpoint | Description | Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/appointments` | Get a list of appointments. | `?customerId=...` (Filter for specific user) |
| `POST` | `/appointments` | Create a new confirmed booking. | `{ id, customerId, customerName, serviceId, serviceName, date, time, price, status, createdAt }` |

## Authentication Note
Since this is a simple local backend, "Authentication" is handled by the frontend `AuthContext` querying the `/users` endpoint.
- **Login**: `GET /users?email=...&password=...`
- **Signup**: `POST /users`
