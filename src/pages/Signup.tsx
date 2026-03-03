import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, Phone } from 'lucide-react';
import { APP_NAME } from '../config';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(email, password, name, phone);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create account.');
            if (err.code === 'auth/configuration-not-found' || err.message?.includes('auth/configuration-not-found')) {
                setError('Error: Email/Password login is not enabled in Firebase Console.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="card w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl text-accent mb-2">Join {APP_NAME}</h1>
                    <p className="text-muted">Create an account to book your cut</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input pl-10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="input pl-10"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="email"
                            placeholder="Email Details"
                            className="input pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};
