import { useState } from 'react';
import { ServiceManagement } from '../components/ServiceManagement';
import { ScheduleManagement } from '../components/ScheduleManagement';
import { BookingsList } from '../components/BookingsList';

export const AdminDashboard = () => {

    const [activeTab, setActiveTab] = useState<'services' | 'schedule' | 'bookings'>('bookings');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted">Manage your business operations</p>
            </div>

            <div className="flex gap-4 mb-8 border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'bookings' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'}`}
                >
                    Bookings
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'schedule' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'}`}
                >
                    Schedule & Availability
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'services' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'}`}
                >
                    Services
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'services' && <ServiceManagement />}
                {activeTab === 'schedule' && <ScheduleManagement />}
                {activeTab === 'bookings' && <BookingsList />}
            </div>
        </div>
    );
};
