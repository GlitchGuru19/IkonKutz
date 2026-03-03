export interface UserProfile {
    uid: string; // to match existing code usage, though json-server uses 'id'
    id: string;
    email: string;
    role: 'admin' | 'customer';
    displayName?: string;
    phone?: string;
    password?: string; // stored locally for simple auth check
}

export interface Service {
    id: string; // json-server uses string ids usually
    name: string;
    price: number;
    durationMinutes: number;
    description?: string;
}

export interface Appointment {
    id: string;
    customerId: string;
    customerName: string;
    serviceId: string;
    serviceName: string;
    date: string; // ISO date YYYY-MM-DD
    time: string; // HH:mm
    price: number;
    status: 'booked' | 'completed' | 'cancelled';
    createdAt: number;
}

export interface TimeSlot {
    id: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    isBooked: boolean;
    bookedBy?: string; // userId
    isLocked?: boolean;
}
