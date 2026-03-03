import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { Navigate } from 'react-router-dom';
import { BookingsList } from '../components/BookingsList';

export const Dashboard = () => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    if (isAdmin) {
        return <AdminDashboard />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted mb-8">View and manage your appointments</p>
            <BookingsList userId={user.uid} />
        </div>
    );
};
