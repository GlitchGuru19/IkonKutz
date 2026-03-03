import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Service } from '../types';
import { Plus, Trash, X, Check } from 'lucide-react';
import { CURRENCY } from '../config';

export const ServiceManagement = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // New service form state
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const fetchServices = async () => {
        try {
            const fetched = await api.get('/services') as Service[];
            setServices(fetched);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/services', {
                id: crypto.randomUUID(), // Local ID
                name: newName,
                price: Number(newPrice),
                description: newDesc,
                durationMinutes: 50
            });
            // Reset and refresh
            setNewName('');
            setNewPrice('');
            setNewDesc('');
            setIsAdding(false);
            fetchServices();
        } catch (error) {
            console.error("Error adding service:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.delete(`/services/${id}`);
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Services</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary gap-2"
                >
                    {isAdding ? <X size={18} /> : <Plus size={18} />}
                    {isAdding ? 'Cancel' : 'Add Service'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddService} className="card p-4 space-y-4 border-accent animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold">New Service</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            placeholder="Service Name (e.g. Haircut)"
                            className="input"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="input"
                            value={newPrice}
                            onChange={e => setNewPrice(e.target.value)}
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        className="input h-24 resize-none"
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary gap-2">
                            <Check size={18} /> Save Service
                        </button>
                    </div>
                </form>
            )}

            <div className="grid gap-4">
                {loading ? <div className="text-muted">Loading services...</div> : services.length === 0 ? (
                    <div className="text-muted text-center py-8">No services added yet. Add one to get started.</div>
                ) : (
                    services.map(service => (
                        <div key={service.id} className="card p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{service.name}</h3>
                                <p className="text-muted text-sm">{service.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-accent mb-2">{CURRENCY}{service.price}</div>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="text-danger hover:bg-red-500/10 p-2 rounded transition-colors"
                                    title="Delete Service"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
