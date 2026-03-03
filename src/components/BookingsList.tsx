import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Appointment } from '../types';
import { format } from 'date-fns';

interface Props {
    userId?: string;
}

export const BookingsList = ({ userId }: Props) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let fetched: Appointment[];
            if (userId) {
                // Should use filter query
                fetched = await api.get(`/appointments?customerId=${userId}`) as Appointment[];
            } else {
                fetched = await api.get('/appointments') as Appointment[];
            }

            // Client side sort since simple json server
            fetched.sort((a, b) => {
                const dateA = a.date + a.time;
                const dateB = b.date + b.time;
                return dateB.localeCompare(dateA);
            });

            setAppointments(fetched);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [userId]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">{userId ? 'My Bookings' : 'All Bookings'}</h2>

            {loading ? <div>Loading bookings...</div> : appointments.length === 0 ? (
                <div className="text-muted">No bookings found.</div>
            ) : (
                <div className="grid gap-3">
                    {appointments.map(apt => (
                        <div key={apt.id} className="card p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <div className="font-bold text-lg">{format(new Date(apt.date), 'EEE, d MMM')} at {apt.time}</div>
                                <div className="text-accent">{apt.serviceName}</div>
                                <div className="text-sm text-muted">Customer: {apt.customerName}</div>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded text-xs uppercase ${apt.status === 'booked' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {apt.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
