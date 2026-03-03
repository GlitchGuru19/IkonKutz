import { useState, useEffect } from 'react';
import { api } from '../api';
import type { TimeSlot } from '../types';
import { format, addDays, isSameDay } from 'date-fns';
import { AVAILABLE_DAYS } from '../config';

interface Props {
    onSelect: (slot: TimeSlot) => void;
    selectedSlot?: TimeSlot;
}

export const SlotSelection = ({ onSelect, selectedSlot }: Props) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);

    // Only allow selecting Sat/Sun as per requirements
    // Generate dates
    const getAvailableDates = () => {
        const dates: Date[] = [];
        let current = new Date();
        for (let i = 0; i < 14; i++) { // Next 2 weeks
            if (AVAILABLE_DAYS.includes(current.getDay())) {
                dates.push(new Date(current));
            }
            current = addDays(current, 1);
        }
        return dates;
    };

    const dates = getAvailableDates();

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            try {
                // Using local API
                const fetched = await api.get(`/slots?date=${dateStr}`) as TimeSlot[];

                // Filter out blocked/booked
                const available = fetched.filter(s => !s.isBooked && !s.isLocked);
                available.sort((a, b) => a.time.localeCompare(b.time));

                setSlots(available);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [selectedDate]);

    return (
        <div className="space-y-6">
            <div className="flex gap-4 overflow-x-auto pb-4 border-b border-gray-800 scrollbar-hide">
                {dates.map(date => (
                    <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`
                            flex flex-col items-center min-w-[80px] p-3 rounded-lg border transition-colors shrink-0
                            ${isSameDay(date, selectedDate)
                                ? 'bg-accent text-bg border-accent'
                                : 'bg-surface border-border hover:border-muted'}
                        `}
                    >
                        <span className="text-xs uppercase">{format(date, 'EEE')}</span>
                        <span className="text-xl font-bold">{format(date, 'd')}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {loading ? <div className="col-span-full text-center py-8">Checking availability...</div> :
                    slots.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-muted">No available slots for this day.</div>
                    ) : (
                        slots.map(slot => (
                            <button
                                key={slot.id}
                                onClick={() => onSelect(slot)}
                                className={`
                                p-3 rounded border text-center transition-all
                                ${selectedSlot?.id === slot.id
                                        ? 'bg-accent text-bg border-accent shadow-lg shadow-accent/20'
                                        : 'bg-surface border-border hover:border-muted hover:bg-surface/80'}
                            `}
                            >
                                <span className="text-lg font-bold">{slot.time}</span>
                            </button>
                        ))
                    )
                }
            </div>
        </div>
    );
};
