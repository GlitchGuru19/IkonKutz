

const API_URL = 'http://localhost:3000';

export const api = {
    // Generic Fetch Wrapper
    get: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`);
        return response.json();
    },
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },
    patch: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },
    delete: async (endpoint: string) => {
        await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
    }
};
