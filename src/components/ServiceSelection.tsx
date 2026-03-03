import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Service } from '../types';
import { CURRENCY } from '../config';

interface Props {
    onSelect: (service: Service) => void;
    selectedId?: string;
}

export const ServiceSelection = ({ onSelect, selectedId }: Props) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const fetched = await api.get('/services') as Service[];
                setServices(fetched);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) return <div className="text-muted text-center py-8">Loading services...</div>;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {services.map(service => (
                <div
                    key={service.id}
                    onClick={() => onSelect(service)}
                    className={`
                        card p-4 cursor-pointer transition-all hover:border-accent
                        ${selectedId === service.id ? 'border-accent bg-accent/10' : 'border-border'}
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <span className="font-bold text-accent">{CURRENCY} {service.price}</span>
                    </div>
                    {service.description && (
                        <p className="text-sm text-muted">{service.description}</p>
                    )}
                    <div className="mt-4 text-xs text-muted uppercase tracking-wider">
                        {service.durationMinutes} Minutes
                    </div>
                </div>
            ))}
        </div>
    );
};
