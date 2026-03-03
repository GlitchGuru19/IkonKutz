import { useState } from 'react';
import { ServiceSelection } from '../components/ServiceSelection';
import { SlotSelection } from '../components/SlotSelection';
import type { Service, TimeSlot } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { CURRENCY } from '../config';

export const BookingPage = () => {
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (!user || !selectedService || !selectedSlot) return;
        setIsSubmitting(true);
        try {
            // 1. Create Appointment
            await api.post('/appointments', {
                id: crypto.randomUUID(), // Local ID generation
                customerId: user.uid,
                customerName: userProfile?.displayName || user.email || "Unknown",
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                date: selectedSlot.date,
                time: selectedSlot.time,
                price: selectedService.price,
                status: 'booked',
                createdAt: Date.now()
            });

            // 2. Mark Slot as Booked
            await api.patch(`/slots/${selectedSlot.id}`, {
                isBooked: true,
                bookedBy: user.uid
            });

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Book Appointment</h1>

            {/* Steps Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-accent text-bg' : 'bg-surface border'}`}>1</div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-accent' : 'bg-surface'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-accent text-bg' : 'bg-surface border'}`}>2</div>
                <div className={`w-12 h-1 ${step >= 3 ? 'bg-accent' : 'bg-surface'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-accent text-bg' : 'bg-surface border'}`}>3</div>
            </div>

            <div className="min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-bold">Select Service</h2>
                        <ServiceSelection
                            onSelect={(s) => { setSelectedService(s); setStep(2); }}
                            selectedId={selectedService?.id}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 mb-4">
                            <button onClick={() => setStep(1)} className="text-muted hover:text-white"><ChevronLeft /></button>
                            <h2 className="text-xl font-bold">Select Date & Time</h2>
                        </div>
                        <SlotSelection
                            onSelect={(s) => { setSelectedSlot(s); }}
                            selectedSlot={selectedSlot || undefined}
                        />
                        <div className="flex justify-end mt-8">
                            <button
                                disabled={!selectedSlot}
                                onClick={() => setStep(3)}
                                className="btn btn-primary gap-2"
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && selectedService && selectedSlot && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 mb-4">
                            <button onClick={() => setStep(2)} className="text-muted hover:text-white"><ChevronLeft /></button>
                            <h2 className="text-xl font-bold">Confirm Booking</h2>
                        </div>

                        <div className="card p-6 space-y-4 border-accent/50">
                            <div className="flex justify-between border-b border-gray-700 pb-4">
                                <span className="text-muted">Service</span>
                                <span className="font-bold">{selectedService.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-4">
                                <span className="text-muted">Date</span>
                                <span className="font-bold">{selectedSlot.date}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-4">
                                <span className="text-muted">Time</span>
                                <span className="font-bold">{selectedSlot.time}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-lg">Total Price</span>
                                <span className="text-xl font-bold text-accent">{CURRENCY} {selectedService.price}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="btn btn-primary w-full py-4 text-lg font-bold mt-8"
                        >
                            {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
