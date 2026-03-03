import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { APP_NAME } from '../config';
import { LogOut, Menu, X, Scissors } from 'lucide-react';
import { useState } from 'react';

export const Layout = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-gray-800 bg-slate-900 sticky top-0 z-50">
                <div className="container flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold flex items-center gap-sm text-accent">
                        <Scissors size={24} />
                        {APP_NAME}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-lg">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-muted hover:text-white">Login</Link>
                                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="text-muted hover:text-white">
                                    {isAdmin ? 'Admin Dashboard' : 'My Bookings'}
                                </Link>
                                {isAdmin && (
                                    <Link to="/services" className="text-muted hover:text-white">Services</Link>
                                )}
                                {!isAdmin && (
                                    <Link to="/book" className="btn btn-primary">Book Now</Link>
                                )}
                                <button onClick={handleLogout} className="flex items-center gap-sm text-muted hover:text-danger">
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-800 bg-slate-900 p-4 flex flex-col gap-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="block py-2 text-muted" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link to="/signup" className="block py-2 text-white" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="block py-2 text-muted" onClick={() => setIsMenuOpen(false)}>
                                    {isAdmin ? 'Admin Dashboard' : 'My Bookings'}
                                </Link>
                                {!isAdmin && (
                                    <Link to="/book" className="block py-2 text-accent" onClick={() => setIsMenuOpen(false)}>Book a Cut</Link>
                                )}
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-sm py-2 text-muted">
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </header>

            <main className="flex-1 container py-8">
                <Outlet />
            </main>

            <footer className="border-t border-gray-800 py-6 text-center text-muted text-sm">
                &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </footer>
        </div>
    );
};
