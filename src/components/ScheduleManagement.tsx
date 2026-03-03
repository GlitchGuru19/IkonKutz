import { useState, useEffect } from 'react';
import { api } from '../api';
import type { TimeSlot } from '../types';
import { OPENING_HOUR, CLOSING_HOUR, SLOT_DURATION_MINUTES, AVAILABLE_DAYS, LUNCH_BREAK_DURATION_MINUTES } from '../config';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export const ScheduleManagement = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);

    // Generate upcoming dates (e.g., next 4 weeks of Sat/Sun)
    const getUpcomingWeekends = () => {
        const dates: Date[] = [];
        let current = new Date();
        // Start looking from today
        for (let i = 0; i < 30; i++) {
            if (AVAILABLE_DAYS.includes(current.getDay())) {
                dates.push(new Date(current));
            }
            current = addDays(current, 1);
        }
        return dates;
    };

    const upcomingDates = getUpcomingWeekends();

    const fetchSlots = async (date: Date) => {
        setLoading(true);
        const dateStr = format(date, 'yyyy-MM-dd');
        try {
            const fetchedSlots = await api.get(`/slots?date=${dateStr}`) as TimeSlot[];
            setSlots(fetchedSlots.sort((a, b) => a.time.localeCompare(b.time)));
        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate]);

    const generateSlotsForDay = async () => {
        setLoading(true);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        // Generate new slots locally first
        const newSlots = [];
        let currentTime = new Date(selectedDate);
        currentTime.setHours(OPENING_HOUR, 0, 0, 0); // 08:00
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(CLOSING_HOUR, 0, 0, 0); // 17:00

        while (currentTime < endOfDay) {
            const timeString = format(currentTime, 'HH:mm');
            const hour = currentTime.getHours();
            const minutes = currentTime.getMinutes();

            let isLunch = false;
            // Heuristic: If time is between 11:50 and 12:30, it's lunch.
            if (hour === 12 && minutes < 40) {
                isLunch = true;
            }

            if (isLunch) {
                // Skip this time, move forward by Break Duration
                currentTime.setMinutes(currentTime.getMinutes() + LUNCH_BREAK_DURATION_MINUTES);
                continue;
            }

            // Create slot object
            newSlots.push({
                id: crypto.randomUUID(),
                date: dateStr,
                time: timeString,
                isBooked: false,
                isLocked: false
            });

            currentTime.setMinutes(currentTime.getMinutes() + SLOT_DURATION_MINUTES);
        }

        // Post all new slots to json-server
        // json-server doesn't support batch, so we must loop
        // To be fast, we use Promise.all
        await Promise.all(newSlots.map(slot => api.post('/slots', slot)));

        fetchSlots(selectedDate);
    };

    const toggleSlotLock = async (slot: TimeSlot) => {
        try {
            await api.patch(`/slots/${slot.id}`, { isLocked: !slot.isLocked });
            // Update local state
            setSlots(slots.map(s => s.id === slot.id ? { ...s, isLocked: !s.isLocked } : s));
        } catch (error) {
            console.error("Error updating slot:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 overflow-x-auto pb-4 border-b border-gray-800">
                {upcomingDates.map(date => (
                    <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`
                            flex flex-col items-center min-w-[80px] p-3 rounded-lg border transition-colors
                            ${isSameDay(date, selectedDate)
                                ? 'bg-accent text-bg border-accent'
                                : 'bg-surface border-border hover:border-muted'}
                        `}
                    >
                        <span className="text-xs uppercase">{format(date, 'EEE')}</span>
                        <span className="text-xl font-bold">{format(date, 'd')}</span>
                        <span className="text-xs">{format(date, 'MMM')}</span>
                    </button>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Availability for {format(selectedDate, 'EEEE, d MMMM')}</h2>

                {slots.length === 0 && !loading && (
                    <div className="text-center py-8 card border-dashed">
                        <p className="text-muted mb-4">No slots generated for this day.</p>
                        <button onClick={generateSlotsForDay} className="btn btn-primary">
                            Generate Default Schedule
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {slots.map(slot => (
                        <div
                            key={slot.id}
                            className={`
                                p-3 rounded border text-center relative
                                ${slot.isBooked ? 'bg-red-900/20 border-red-900/50' :
                                    slot.isLocked ? 'bg-gray-800 border-gray-700 opacity-50' :
                                        'bg-surface border-accent/20'}
                            `}
                        >
                            <div className="text-lg font-bold">{slot.time}</div>
                            <div className="text-xs mt-1">
                                {slot.isBooked ? <span className="text-danger">Booked</span> :
                                    slot.isLocked ? <span className="text-muted">Unavailable</span> :
                                        <span className="text-success">Available</span>}
                            </div>

                            {!slot.isBooked && (
                                <button
                                    onClick={() => toggleSlotLock(slot)}
                                    className="absolute top-1 right-1 p-1 hover:bg-gray-700 rounded"
                                    title={slot.isLocked ? "Unlock" : "Block"}
                                >
                                    {slot.isLocked ? <CalendarIcon size={12} /> : <X size={12} />}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
